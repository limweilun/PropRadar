import pandas as pd
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOV_API_KEY = os.getenv('GOV_DATA_API_KEY')

def fetch_hdb_data():
    """Fetch HDB resale data from data.gov.sg API"""
    # Get data for the last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    headers = {
        'api-key': GOV_API_KEY
    }
    
    url = f"https://data.gov.sg/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=&filters=%7B%22month%22%3A%7B%22%24gte%22%3A%22{start_date.strftime('%Y-%m')}%22%2C%22%24lte%22%3A%22{end_date.strftime('%Y-%m')}%22%7D%7D"
    
    response = requests.get(url, headers=headers)
    data = response.json()
    
    return pd.DataFrame(data['result']['records'])

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

def calculate_undervaluation(df):
    """Calculate undervaluation scores for properties"""
    # Group by town and flat_type to get median price per sqft
    median_prices = df.groupby(['town', 'flat_type'])['price_per_sqft'].median().reset_index()
    median_prices.rename(columns={'price_per_sqft': 'median_price_per_sqft'}, inplace=True)
    
    # Merge with original data
    df = pd.merge(df, median_prices, on=['town', 'flat_type'], how='left')
    
    # Calculate undervaluation score (% below/above median)
    df['undervaluation_score'] = ((df['median_price_per_sqft'] - df['price_per_sqft']) / df['median_price_per_sqft']) * 100
    
    return df

def main():
    # Extract
    raw_data = fetch_hdb_data()
    
    # Transform
    processed_data = process_hdb_data(raw_data)
    final_data = calculate_undervaluation(processed_data)
    
    # Load (would connect to Supabase in production)
    final_data.to_csv('processed_hdb_data.csv', index=False)
    print(f"Processed {len(final_data)} HDB transactions")

if __name__ == "__main__":
    main()