# Production Setup & Deployment Guide

This guide covers the setup process for deploying PropRadar to production environments.

## Prerequisites

- An Expo account (https://expo.dev/signup)
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)
- Access to Google Cloud Console (for Maps API keys)

## Environment Setup

### 1. Create API Keys

#### Google Maps API Keys

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the following APIs:
   - Maps SDK for iOS
   - Maps SDK for Android
   - Places API (if using place search)
4. Create two separate API keys:
   - One for Android (restrict to Android apps with your package name)
   - One for iOS (restrict to iOS apps with your bundle identifier)
5. Add these keys to your production `.env` file:
   ```
   GOOGLE_MAPS_ANDROID_API_KEY=your_android_key
   GOOGLE_MAPS_IOS_API_KEY=your_ios_key
   ```

#### Singapore Property Data Services

1. Set up access to necessary data services:

   - **HDB Resale Flat Prices Dataset**:
     - No API key required
     - Data is publicly accessible from [Data.gov.sg - Resale Flat Prices](https://data.gov.sg/dataset/resale-flat-prices)
     - The ETL script in `/etl/sample_etl.py` handles direct fetching, pagination, and local caching
     - For production deployment, consider setting up a scheduled job to fetch this data periodically

   - **URA API** (for private property data - optional):
     - Visit [URA Digital Planning Lab](https://www.ura.gov.sg/Corporate/Guidelines/Digital-Planning-Lab/Urban-Planning-Tech)
     - Email [digitalhub@ura.gov.sg](mailto:digitalhub@ura.gov.sg) with your use case to request API access
     - Follow the instructions in their response to obtain your API key

   - **OneMap API** (for geocoding - optional):
     - Register at [OneMap API Documentation](https://www.onemap.gov.sg/apidocs/)
     - Create an account and generate your API key from the developer console

2. Add any optional API keys to your production `.env` file

### 2. Configure EAS

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project:
   ```bash
   # This creates eas.json if it doesn't exist
   eas build:configure
   ```

4. Update the project ID in app.json:
   ```json
   "extra": {
     "eas": {
       "projectId": "your-eas-project-id"
     }
   }
   ```

## Preparing for App Stores

### iOS Setup

1. Register your bundle identifier in Apple Developer Portal
2. Create an App ID in App Store Connect
3. Generate necessary certificates and provisioning profiles
4. Update eas.json with your Apple credentials:
   ```json
   "submit": {
     "production": {
       "ios": {
         "appleId": "your-apple-id@example.com",
         "ascAppId": "your-app-store-connect-app-id",
         "appleTeamId": "YOUR_APPLE_TEAM_ID"
       }
     }
   }
   ```

### Android Setup

1. Register your app in Google Play Console
2. Create a service account for API access
3. Download the JSON key file
4. Update eas.json with the path to your service account key:
   ```json
   "submit": {
     "production": {
       "android": {
         "serviceAccountKeyPath": "path/to/service-account.json",
         "track": "production"
       }
     }
   }
   ```

## Building the Production App

1. Create a production `.env` file with all required API keys and settings:
   ```
   # Set environment to production
   ENVIRONMENT=production
   
   # Use production API endpoints
   API_BASE_URL=https://api.propradar.sg
   
   # Enable analytics and crash reporting
   ENABLE_ANALYTICS=true
   ENABLE_CRASH_REPORTING=true
   
   # Add all your API keys
   GOOGLE_MAPS_ANDROID_API_KEY=your_key
   GOOGLE_MAPS_IOS_API_KEY=your_key
   GOV_DATA_API_KEY=your_key
   URA_API_KEY=your_key
   ONEMAP_API_KEY=your_key
   ```

2. Build for production:
   ```bash
   # Build for both platforms
   eas build --profile production --platform all
   
   # Or build for specific platform
   eas build --profile production --platform ios
   eas build --profile production --platform android
   ```

3. Monitor the build in the EAS dashboard at https://expo.dev

## Submitting to App Stores

### Automated Submission

After the build completes, you can automatically submit to app stores:

```bash
# Submit both platforms
eas submit --platform all

# Or submit to specific platforms
eas submit --platform ios
eas submit --platform android
```

### Manual Submission

Alternatively, you can download the builds from EAS and submit them manually:

1. For iOS: Upload the .ipa file via App Store Connect or Transporter
2. For Android: Upload the .aab file via Google Play Console

## Production Maintenance

### Updating the App

1. Update your code and version numbers in app.json:
   ```json
   "version": "1.0.1",
   "ios": {
     "buildNumber": "2"
   },
   "android": {
     "versionCode": 2
   }
   ```

2. Build and submit the new version:
   ```bash
   eas build --profile production --platform all
   eas submit --platform all
   ```

### Monitoring and Analytics

Consider integrating:
- Sentry for crash reporting
- Firebase Analytics for user behavior tracking
- Expo Application Services for over-the-air updates

## Troubleshooting

### Common Issues

- **Map not displaying**: Verify API keys and restrictions
- **Build failing**: Check EAS build logs for specific errors
- **Submission rejected**: Review App Store Guidelines or Google Play Policies

### Support Resources

- Expo Documentation: https://docs.expo.dev/
- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- React Native Maps Documentation: https://github.com/react-native-maps/react-native-maps

## Security Considerations

- Never commit `.env` files or API keys to version control
- Use appropriate API key restrictions
- Implement certificate pinning for sensitive API requests
- Regularly rotate API keys and review access logs