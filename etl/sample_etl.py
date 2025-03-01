import pandas as pd
import numpy as np
import requests
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

def fetch_hdb_data():
    """Fetch HDB resale data from data.gov.sg API
    
    Note: No API key is required for this public dataset.
    We directly fetch from the Data.gov.sg API and handle pagination.
    """
    # Get data for the last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Resource ID for HDB resale flat prices
    resource_id = "f1765b54-a209-4718-8d38-a39237f502b3"
    
    # Initial URL
    base_url = "https://data.gov.sg/api/action/datastore_search"
    
    # Filter for date range (URL encoded JSON)
    date_filter = f'%7B%22month%22%3A%7B%22%24gte%22%3A%22{start_date.strftime("%Y-%m")}%22%2C%22%24lte%22%3A%22{end_date.strftime("%Y-%m")}%22%7D%7D'
    
    url = f"{base_url}?resource_id={resource_id}&q=&filters={date_filter}"
    
    all_records = []
    offset = 0
    limit = 100
    
    # Paginate through all results
    while True:
        print(f"Fetching records with offset {offset}...")
        
        # Add pagination parameters
        paginated_url = f"{url}&offset={offset}&limit={limit}"
        
        try:
            response = requests.get(paginated_url)
            response.raise_for_status()  # Raise exception for HTTP errors
            
            data = response.json()
            records = data['result']['records']
            
            if not records:
                break
                
            all_records.extend(records)
            
            # If fetched records is less than limit, we've reached the end
            if len(records) < limit:
                break
                
            offset += limit
            
            # Be nice to the API with a small delay between requests
            time.sleep(0.5)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            break
    
    print(f"Total records fetched: {len(all_records)}")
    
    # Cache the data locally
    with open('hdb_data_cache.json', 'w') as f:
        json.dump(all_records, f)
    
    return pd.DataFrame(all_records)

def process_hdb_data(df):
    """Process and normalize HDB data"""
    # Clean and transform data
    df['floor_area_sqm'] = pd.to_numeric(df['floor_area_sqm'])
    df['resale_price'] = pd.to_numeric(df['resale_price'])
    
    # Convert to square feet
    df['floor_area_sqft'] = df['floor_area_sqm'] * 10.764
    
    # Calculate price per square foot
    df['price_per_sqft'] = df['resale_price'] / df['floor_area_sqft']
    
    # Extract room type from flat_type
    df['room_type'] = df['flat_type']
    
    # Format address with unit number (extracted from address and storey_range)
    df['formatted_address'] = df.apply(lambda x: f"Block {x['block']}, #{x['storey_range'].split(' ')[0]}-{x['flat_model'][:3]}, {x['street_name']}", axis=1)
    
    return df

def extract_floor_level(storey_range):
    """Extract numeric floor level from storey range."""
    # Storey ranges are typically like "01 TO 03", "04 TO 06", etc.
    try:
        # Get the first number in the range
        level = storey_range.split(' ')[0]
        return int(level)
    except (ValueError, IndexError, AttributeError):
        return 0  # Default if extraction fails

def calculate_remaining_lease(lease_commence_date):
    """Calculate remaining lease years based on lease commencement date."""
    try:
        current_year = datetime.now().year
        lease_start = int(lease_commence_date)
        # HDB leases are typically 99 years
        return lease_start + 99 - current_year
    except (ValueError, TypeError):
        return 70  # Default average remaining lease

def calculate_proximity_score(town):
    """
    Approximate MRT proximity score based on town.
    In a real implementation, this would use actual geocoordinates and MRT station data.
    """
    # Simplified mapping of towns to MRT density/accessibility (1-10 scale)
    # Higher values mean better MRT access
    mrt_proximity = {
        'ANG MO KIO': 8, 'BEDOK': 7, 'BISHAN': 9, 'BUKIT BATOK': 6, 
        'BUKIT MERAH': 8, 'BUKIT PANJANG': 6, 'BUKIT TIMAH': 7,
        'CENTRAL AREA': 10, 'CHOA CHU KANG': 5, 'CLEMENTI': 7,
        'GEYLANG': 8, 'HOUGANG': 6, 'JURONG EAST': 8, 'JURONG WEST': 6,
        'KALLANG/WHAMPOA': 8, 'MARINE PARADE': 6, 'PASIR RIS': 5,
        'PUNGGOL': 7, 'QUEENSTOWN': 8, 'SEMBAWANG': 4, 'SENGKANG': 7,
        'SERANGOON': 8, 'TAMPINES': 7, 'TOA PAYOH': 9, 'WOODLANDS': 6,
        'YISHUN': 6
    }
    return mrt_proximity.get(town, 5)  # Default to 5 if town not found

def calculate_undervaluation(df):
    """
    Calculate undervaluation scores for properties with enhanced factors:
    - Floor level
    - Remaining lease
    - Proximity to MRT/amenities
    - Unit size category
    """
    # 1. Extract and add additional factors
    # Extract floor level from storey_range
    df['floor_level'] = df['storey_range'].apply(extract_floor_level)
    
    # Calculate remaining lease where available
    if 'lease_commence_date' in df.columns:
        df['remaining_lease'] = df['lease_commence_date'].apply(calculate_remaining_lease)
    else:
        # Estimate based on town and flat_type if lease data not available
        # This is a placeholder - in a real implementation, you might have additional data
        df['remaining_lease'] = 70  # Average placeholder
    
    # Calculate MRT proximity score
    df['mrt_proximity'] = df['town'].apply(calculate_proximity_score)
    
    # Categorize flat size
    df['size_category'] = pd.cut(
        df['floor_area_sqft'], 
        bins=[0, 700, 900, 1100, 1400, float('inf')],
        labels=['Very Small', 'Small', 'Medium', 'Large', 'Very Large']
    )
    
    # 2. Create more precise grouping for comparison
    # Group by multiple factors to find similar properties
    grouping_factors = ['town', 'flat_type', 'size_category']
    
    # Add floor level grouping to distinguish low/mid/high floors
    df['floor_category'] = pd.cut(
        df['floor_level'], 
        bins=[0, 5, 12, float('inf')],
        labels=['Low Floor', 'Mid Floor', 'High Floor']
    )
    grouping_factors.append('floor_category')
    
    # Calculate median prices for similar properties
    median_prices = df.groupby(grouping_factors)['price_per_sqft'].median().reset_index()
    median_prices.rename(columns={'price_per_sqft': 'median_price_per_sqft'}, inplace=True)
    
    # Merge with original data
    df = pd.merge(df, median_prices, on=grouping_factors, how='left')
    
    # 3. Handle missing median values (for rare property combinations)
    # If specific grouping has no median, fall back to less specific grouping
    if df['median_price_per_sqft'].isna().any():
        # Fallback to town + flat_type only
        fallback_medians = df.groupby(['town', 'flat_type'])['price_per_sqft'].median().reset_index()
        fallback_medians.rename(columns={'price_per_sqft': 'fallback_median'}, inplace=True)
        
        df = pd.merge(df, fallback_medians, on=['town', 'flat_type'], how='left')
        
        # Use fallback where needed
        df['median_price_per_sqft'] = df['median_price_per_sqft'].fillna(df['fallback_median'])
        df = df.drop('fallback_median', axis=1)
    
    # 4. Apply adjustments for other factors
    # Newer units (more remaining lease) are typically valued higher
    lease_adjustment = (df['remaining_lease'] - df.groupby('town')['remaining_lease'].transform('median')) * 0.2
    
    # MRT proximity affects property value
    mrt_adjustment = (df['mrt_proximity'] - 5) * 0.5  # Adjust up to ±2.5% based on MRT access
    
    # 5. Calculate final undervaluation score with adjustments
    # Basic score: difference from median as percentage
    base_score = ((df['median_price_per_sqft'] - df['price_per_sqft']) / df['median_price_per_sqft']) * 100
    
    # Apply adjustments - a good property with a low price gets a higher score
    df['undervaluation_score'] = base_score + lease_adjustment + mrt_adjustment
    
    # 6. Add confidence rating for the score
    # Properties with many similar comparables get higher confidence
    group_counts = df.groupby(grouping_factors).size().reset_index(name='comparable_count')
    df = pd.merge(df, group_counts, on=grouping_factors, how='left')
    
    df['valuation_confidence'] = pd.cut(
        df['comparable_count'], 
        bins=[0, 3, 10, 20, float('inf')],
        labels=['Low', 'Medium', 'High', 'Very High']
    )
    
    return df

def prepare_for_frontend(df):
    """
    Prepare the processed data for frontend consumption.
    Creates a JSON structure that matches the frontend Property type.
    """
    # Sample a subset of properties for demo purposes
    # In production, you would include all properties
    sample_size = min(100, len(df))
    sample_df = df.sample(n=sample_size, random_state=42)
    
    properties = []
    
    for _, row in sample_df.iterrows():
        # Create a unique ID
        property_id = f"{row['town'].lower().replace(' ', '-')}-{row['flat_type'].lower()}-{row['street_name'].lower().replace(' ', '-')}-{row['block']}"
        
        # Generate a property name
        property_name = f"{row['flat_type']} at {row['street_name']}"
        
        # Format address
        address = f"Block {row['block']}, {row['street_name']}"
        
        # Basic property data
        property_data = {
            "id": property_id,
            "name": property_name,
            "address": address,
            "pricePerSqft": round(row['price_per_sqft'], 2),
            "size": row['floor_area_sqft'],
            "type": "HDB",  # All are HDB in this dataset
            "roomType": row['flat_type'],
            "undervaluationScore": round(row['undervaluation_score'], 1),
            "valuationConfidence": row['valuation_confidence'],
            
            # Placeholder coordinates - in production, you would use actual geocoding
            # Here we're adding small random offsets to Singapore's center coordinates
            "coordinates": {
                "latitude": 1.3521 + (np.random.random() - 0.5) * 0.05,
                "longitude": 103.8198 + (np.random.random() - 0.5) * 0.05
            },
            
            # Mock price history - in production, this would be real historical data
            "priceHistory": [
                {"month": "Jan 2023", "price": round(row['price_per_sqft'] * (1 - np.random.random() * 0.05), 2)},
                {"month": "Feb 2023", "price": round(row['price_per_sqft'] * (1 - np.random.random() * 0.03), 2)},
                {"month": "Mar 2023", "price": round(row['price_per_sqft'] * (1 - np.random.random() * 0.01), 2)},
                {"month": "Apr 2023", "price": round(row['price_per_sqft'], 2)},
                {"month": "May 2023", "price": round(row['price_per_sqft'] * (1 + np.random.random() * 0.01), 2)},
                {"month": "Jun 2023", "price": round(row['price_per_sqft'] * (1 + np.random.random() * 0.02), 2)}
            ],
            
            # Additional details for enhanced algorithm
            "additionalDetails": {
                "floorLevel": row['floor_level'],
                "floorCategory": row['floor_category'],
                "remainingLease": int(row['remaining_lease']),
                "mrtProximity": row['mrt_proximity'],
                "comparableCount": row['comparable_count'],
                "medianAreaPrice": round(row['median_price_per_sqft'], 2)
            }
        }
        
        properties.append(property_data)
    
    return properties

def main():
    # Check if cached data exists
    try:
        with open('hdb_data_cache.json', 'r') as f:
            print("Using cached HDB data...")
            cache_data = json.load(f)
            raw_data = pd.DataFrame(cache_data)
            print(f"Loaded {len(raw_data)} records from cache")
    except (FileNotFoundError, json.JSONDecodeError):
        print("No valid cache found, fetching fresh data...")
        # Extract
        raw_data = fetch_hdb_data()
    
    # Transform
    processed_data = process_hdb_data(raw_data)
    final_data = calculate_undervaluation(processed_data)
    
    # Basic save
    final_data.to_csv('processed_hdb_data.csv', index=False)
    print(f"Processed {len(final_data)} HDB transactions")
    
    # Prepare data for frontend and save as JSON
    frontend_data = prepare_for_frontend(final_data)
    with open('frontend_properties.json', 'w') as f:
        json.dump(frontend_data, f, indent=2)
    print(f"Created frontend data with {len(frontend_data)} properties")
    
    # Save some summary statistics
    summary = {
        "total_transactions": len(final_data),
        "date_range": f"{raw_data['month'].min()} to {raw_data['month'].max()}",
        "towns": final_data['town'].nunique(),
        "flat_types": final_data['flat_type'].unique().tolist(),
        "price_range": {
            "min": float(final_data['resale_price'].min()),
            "max": float(final_data['resale_price'].max()),
            "median": float(final_data['resale_price'].median())
        },
        "undervaluation_stats": {
            "undervalued_count": len(final_data[final_data['undervaluation_score'] > 10]),
            "overvalued_count": len(final_data[final_data['undervaluation_score'] < -10]),
            "fair_value_count": len(final_data[(final_data['undervaluation_score'] >= -10) & (final_data['undervaluation_score'] <= 10)]),
            "max_undervaluation": float(final_data['undervaluation_score'].max()),
            "max_overvaluation": float(abs(final_data['undervaluation_score'].min()))
        },
        "confidence_distribution": {
            "very_high": int(final_data['valuation_confidence'].value_counts().get('Very High', 0)),
            "high": int(final_data['valuation_confidence'].value_counts().get('High', 0)),
            "medium": int(final_data['valuation_confidence'].value_counts().get('Medium', 0)),
            "low": int(final_data['valuation_confidence'].value_counts().get('Low', 0))
        },
        "processed_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    with open('processed_stats.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("Processing complete. Summary statistics saved.")

if __name__ == "__main__":
    main()