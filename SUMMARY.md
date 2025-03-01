# PropRadar - Technical Summary

## Project Overview

PropRadar is a React Native mobile application designed to help Singaporeans identify undervalued property opportunities in the real estate market. The app provides a map-centric approach to property exploration, showing color-coded markers based on property valuation relative to market prices.

## Key Components

### Frontend (React Native)

#### State Management
- **Zustand**: Lightweight state management for filters and watchlist
- **AsyncStorage**: For persisting watchlist data across app sessions

#### UI Components
- **Key Screens**:
  - MapScreen: Main interface with interactive map and property pins
  - WatchlistScreen: List of saved properties with alerts
  - InfoScreen: Details about the app and valuation methodology

- **Reusable Components**:
  - PropertyCard: Displays property summary with price, size, and valuation
  - PropertyDetails: Comprehensive property view with trend chart
  - FilterBar: UI for filtering properties by type and price range
  - MapView: Interactive map with property markers

#### Navigation
- **React Navigation**: Tab and stack navigation for seamless user experience

#### Data Visualization
- **React Native Maps**: For displaying property locations
- **Victory Native**: For price trend charts and sparklines

### Backend (Python ETL)

The ETL pipeline (Extract, Transform, Load) is responsible for:

1. **Data Collection**:
   - Fetch HDB resale data from data.gov.sg API
   - Future integration with URA data (private property)

2. **Data Processing**:
   - Calculate price per square foot
   - Normalize property attributes (size, type, location)
   - Compute undervaluation scores by comparing with similar properties

3. **Data Storage**:
   - Format data for app consumption
   - Output to JSON (development) or Supabase PostgreSQL (production)

## Technical Innovations

1. **Smart Valuation Algorithm**:
   - Compares property prices with median prices for similar properties
   - Accounts for property type, location, and recent market trends

2. **Efficient Data Architecture**:
   - Precomputation of complex metrics on backend to minimize app computation
   - Optimized data structures for quick filtering and map rendering

3. **Progressive Loading**:
   - Map clustering for handling thousands of property markers
   - On-demand property detail loading

## Future Technical Roadmap

1. **Authentication & User Profiles**:
   - Supabase Auth for user management
   - Profile personalization and preference saving

2. **Real-time Updates**:
   - Push notifications for watchlist alerts
   - Websocket integration for live price updates

3. **Advanced Analytics**:
   - Machine learning for price prediction
   - District-level trend analysis and recommendations

4. **API Integration**:
   - URA API for private property data
   - Potential integration with PropertyGuru or 99.co APIs

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐    ┌─────────────────┐
│  Data Sources   │     │  ETL Pipeline   │    │  Data Storage   │
│  - data.gov.sg  │────▶│  - Python       │───▶│  - Supabase     │
│  - URA API      │     │  - Transforms   │    │  - PostgreSQL   │
└─────────────────┘     └─────────────────┘    └────────┬────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐    ┌─────────────────┐
│  Mobile App     │     │  State & Logic  │    │  API Layer      │
│  - React Native │◀───▶│  - Zustand      │◀───│  - REST API     │
│  - UI Components│     │  - AsyncStorage │    │  - Supabase SDK │
└─────────────────┘     └─────────────────┘    └─────────────────┘
```

## Performance Considerations

1. **Map Optimization**:
   - Marker clustering for handling thousands of properties
   - Property data lazy loading based on viewport

2. **Storage Efficiency**:
   - Minimal local storage footprint
   - Strategic caching of frequently accessed data

3. **Offline Capability**:
   - Basic functionality when offline
   - Sync watchlist when connection is restored

## Scalability Plan

The app is designed to scale from hundreds to tens of thousands of properties through:

1. **Backend Scalability**:
   - Serverless functions for ETL processes
   - PostgreSQL for structured data storage

2. **Frontend Performance**:
   - Virtualized lists for handling large datasets
   - Optimized rendering with React memo and useCallback

3. **Data Pipeline Growth**:
   - Modular ETL design to add new data sources
   - Structured schema that can accommodate various property types