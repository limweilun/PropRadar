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
  coordinates: {
    latitude: number;
    longitude: number;
  };
  priceHistory: PricePoint[];
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
  addedAt: Date;
  alerts: WatchlistAlert[];
};

export type WatchlistAlert = {
  id: string;
  type: 'PRICE_DROP' | 'UNDERVALUATION_CHANGE';
  message: string;
  createdAt: Date;
  read: boolean;
};