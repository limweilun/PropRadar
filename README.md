# PropRadar - Singapore Property Finder

PropRadar is a React Native mobile application designed to help Singaporeans find undervalued properties based on real HDB resale transaction data and market trends.

<img src="assets/icon.png" alt="PropRadar Logo" width="120"/>

## 📱 Key Features

- **Interactive Map**: View properties across Singapore with color-coded markers showing valuation status
- **Smart Filtering**: Filter properties by type (HDB/Private) and price range
- **Property Details**: Access comprehensive information including price history, valuation metrics, and location details
- **Watchlist**: Save properties to monitor price changes and receive alerts
- **Cross-Platform**: Works seamlessly on both iOS and Android devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/PropRadar-mobile.git
cd PropRadar-mobile
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and add your Google Maps API keys
```

4. Start the development server

```bash
npm start
```

5. Run on your preferred platform
   - Press `i` to open in iOS Simulator
   - Press `a` to open in Android Emulator
   - Scan the QR code with Expo Go app on your phone

## 📊 Data Sources

PropRadar uses real property transaction data from:

- **HDB Resale Transactions**: Public data from [data.gov.sg](https://data.gov.sg/dataset/resale-flat-prices)
  - No API key required
  - Our ETL pipeline automatically fetches, processes, and caches this data
  - Includes ~6 months of historical transactions

- **Undervaluation Algorithm**: Our proprietary algorithm compares property prices with similar units to identify potential deals
  - Compares by location, property type, size, and floor level
  - Calculates price per square foot deviation from median
  - Generates undervaluation scores showing % above or below market value

## 🔑 External Services

The application requires the following:

- **Google Maps API Keys**: 
  - Required for the interactive map functionality
  - Get from [Google Cloud Console](https://console.cloud.google.com/)
  - Separate keys needed for iOS and Android

- **Optional APIs**:
  - **URA API**: For private property data (optional extension)
  - **OneMap API**: For additional geocoding functionality (optional)

## 🏗️ Project Structure

```
PropRadar-mobile/
├── assets/                  # App icons and images
├── config/                  # Configuration files
├── etl/                     # Data processing scripts
│   └── sample_etl.py        # ETL pipeline for HDB data
├── src/
│   ├── components/          # UI components
│   │   ├── FilterBar.tsx    # Property filtering interface
│   │   ├── MapViewComponent.tsx  # Map interface
│   │   ├── PropertyCard.tsx     # Property summary cards
│   │   ├── PropertyDetails.tsx  # Detailed property view
│   │   └── WatchlistItem.tsx    # Watchlist item component
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # Main app screens
│   │   ├── HomeScreen.tsx   # Main map screen
│   │   ├── InfoScreen.tsx   # Information screen
│   │   └── WatchlistScreen.tsx  # Watchlist management
│   ├── services/            # API and backend services
│   ├── state/               # State management (Zustand)
│   ├── types/               # TypeScript definitions
│   └── utils/               # Helper functions
├── .env                     # Environment variables (not in repo)
├── .env.example             # Example environment variables
├── app.json                 # Expo configuration
└── eas.json                 # EAS Build configuration
```

## 📲 Deployment

PropRadar uses Expo Application Services (EAS) for building and deployment. See [DEPLOY.md](DEPLOY.md) for detailed instructions on:

- Setting up API keys
- Building for production
- Submitting to App Store and Google Play

### Quick deployment commands

```bash
# Build a preview version
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Submit to stores
eas submit --platform all
```

## 🧪 Data Processing

PropRadar includes a Python-based ETL pipeline for processing HDB resale data:

1. **Extract**: Fetch public HDB resale transaction data
2. **Transform**: Calculate undervaluation scores based on comparable properties
3. **Load**: Prepare data for the mobile app to consume

To run the ETL pipeline:

```bash
# Navigate to the ETL directory
cd etl

# Install Python dependencies
pip install -r requirements.txt

# Run the ETL script
python sample_etl.py
```

The script will:
- Fetch HDB resale data for the past 6 months
- Process and normalize the data
- Calculate undervaluation scores
- Save the processed data and statistics

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **UI/UX**: NativeWind (Tailwind CSS for React Native)
- **Maps**: React Native Maps (Apple Maps on iOS, Google Maps on Android)
- **State Management**: Zustand
- **Data Storage**: AsyncStorage for local persistence
- **Navigation**: React Navigation (Stack & Tab)
- **Data Processing**: Python with Pandas for ETL

## 🔮 Roadmap

- User authentication and profile management
- Private property data integration
- Price prediction using machine learning
- Push notifications for price alerts
- Social sharing of property finds
- Integration with property listings websites

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for informational purposes only and should not be considered financial advice. Always conduct your own due diligence and consult with real estate professionals before making property investment decisions.