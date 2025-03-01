import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Load environment variables
// In a production app, you would use a proper env management solution
const ENV = {
  // Google Maps API Keys
  googleMapsApiKey: Platform.select({
    ios: process.env.GOOGLE_MAPS_IOS_API_KEY || Constants.expoConfig?.ios?.config?.googleMapsApiKey || '',
    android: process.env.GOOGLE_MAPS_ANDROID_API_KEY || 
             Constants.expoConfig?.android?.config?.googleMaps?.apiKey || '',
    default: '',
  }),
  
  // Property Data APIs
  govDataApiKey: process.env.GOV_DATA_API_KEY || '',
  uraApiKey: process.env.URA_API_KEY || '',
  oneMapApiKey: process.env.ONEMAP_API_KEY || '',
  
  // API Configuration
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  apiRequestTimeoutMs: Number(process.env.API_REQUEST_TIMEOUT_MS || 5000),
  apiMaxRetries: Number(process.env.API_MAX_RETRIES || 3),
  
  // Feature Flags
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  enableCrashReporting: process.env.ENABLE_CRASH_REPORTING === 'true',
  
  // Environment
  environment: process.env.ENVIRONMENT || 'development',
  isDevelopment: (process.env.ENVIRONMENT || 'development') === 'development',
  isStaging: (process.env.ENVIRONMENT || 'development') === 'staging',
  isProduction: (process.env.ENVIRONMENT || 'development') === 'production',
};

export default ENV;