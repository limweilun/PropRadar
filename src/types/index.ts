// Property Types
export enum PropertyType {
  HDB = 'HDB',
  PRIVATE = 'PRIVATE',
}

export type PricePoint = {
  month: string;
  price: number;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  pricePerSqft: number;
  size: number;
  type: PropertyType;
  roomType: string;
  undervaluationScore: number; // Positive means undervalued, negative means overvalued
  valuationConfidence?: 'Low' | 'Medium' | 'High' | 'Very High'; // Confidence in the valuation
  coordinates: {
    latitude: number;
    longitude: number;
  };
  priceHistory: PricePoint[];
  additionalDetails?: {
    floorLevel?: number;
    floorCategory?: string;
    remainingLease?: number;
    mrtProximity?: number;
    comparableCount?: number; // Number of similar properties used for comparison
    medianAreaPrice?: number; // Median price per sqft for similar properties
  };
};

// Map marker types
export enum MarkerCategory {
  UNDERVALUED = 'UNDERVALUED', // >10% below market
  FAIRVALUE = 'FAIRVALUE', // Within ±5% of market
  OVERVALUED = 'OVERVALUED', // >10% above market
}

// Filter types
export type PropertyFilter = {
  propertyType: PropertyType | 'ALL';
  priceRange: [number, number]; // [min, max]
  district?: string;
};

// Watchlist types
export type WatchlistItem = {
  property: Property;
  addedAt: Date | string;
  alerts: WatchlistAlert[];
};

export type WatchlistAlert = {
  id: string;
  type: 'PRICE_DROP' | 'UNDERVALUATION_CHANGE';
  message: string;
  createdAt: Date | string;
  read: boolean;
};