# SmartProperty Finder SG

A React Native mobile application designed to help Singaporeans find undervalued properties based on price trends and transaction data.

## Features

- **Interactive Map View**: View properties across Singapore with color-coded pins representing undervalued, fair value, and overvalued properties
- **Smart Filtering**: Filter properties by type (HDB/Private) and price range
- **Property Details**: Tap on property pins to view detailed information including price per square foot, size, type, and undervaluation score
- **Watchlist**: Save properties to monitor their price changes and receive alerts
- **Price Trends**: View 6-month price trends for each property
- **Undervaluation Metrics**: Clear indication of how each property is valued compared to similar properties in the area

## Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional for testing)

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd PropRadar
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example .env file
cp .env.example .env

# Edit the .env file with your own API keys
```

4. API Keys Required
- **GOV_DATA_API_KEY**: Register at https://data.gov.sg/user/register
- **URA_API_KEY**: Apply at https://www.ura.gov.sg/maps/api/
- **GOOGLE_MAPS_API_KEY**: Get from https://console.cloud.google.com/
- **ONEMAP_API_KEY**: Register at https://www.onemap.gov.sg/home/

5. Start the development server
```bash
npm start
```

6. Run on your device or simulator
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your phone

## Tech Stack

- **Framework**: React Native with Expo
- **UI Libraries**: NativeWind (Tailwind CSS for React Native)
- **Maps**: React Native Maps with Google Maps
- **State Management**: Zustand
- **Storage**: AsyncStorage for local data persistence
- **Navigation**: React Navigation (Stack & Tab)

## Environment Variables

This application uses the following environment variables that must be configured in the `.env` file:

```
# Singapore Government Data API key (data.gov.sg)
GOV_DATA_API_KEY=your_key_here

# URA Property API key
URA_API_KEY=your_key_here

# Google Maps API key for property mapping
GOOGLE_MAPS_API_KEY=your_key_here

# OneMap API key for Singapore-specific mapping
ONEMAP_API_KEY=your_key_here

# API request limits and timeouts
API_REQUEST_TIMEOUT_MS=5000
API_MAX_RETRIES=3
```

## Data Pipeline

### HDB Resale Data ETL Process

The application's backend includes a Python-based ETL pipeline that:

1. **Extracts** data from public APIs:
   - HDB resale transactions from data.gov.sg
   - URA private property transactions (when access is secured)

2. **Transforms** the data by:
   - Normalizing property types and sizes
   - Calculating price per square foot
   - Computing undervaluation scores by comparing with median prices of similar properties

3. **Loads** processed data into:
   - Supabase PostgreSQL database for structured storage
   - Precomputes scores to minimize frontend computation

### Sample ETL Code

```python
# sample_etl.py
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
```

## Future Enhancements

- **User Authentication**: Add user accounts for personalized experiences
- **Private Property Data**: Integrate URA API for private condo transaction data
- **Push Notifications**: Real-time alerts for price changes in watchlisted properties
- **Market Analysis**: Advanced analytics on property market trends
- **Integration with Property Portals**: Connect with PropertyGuru or 99.co APIs (subject to partnerships)
- **Property History**: View detailed transaction history for each property

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for informational purposes only and should not be considered financial advice. Always conduct your own due diligence and consult with real estate professionals before making property investment decisions.