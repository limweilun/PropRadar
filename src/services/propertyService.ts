import { Property, PropertyType } from '../types';

// Mock property data
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Tampines GreenView',
    address: 'Block 123A, #02-134, Tampines Street 45',
    pricePerSqft: 650,
    size: 1200,
    type: PropertyType.HDB,
    roomType: '4-room',
    undervaluationScore: 14, // 14% below market
    coordinates: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    priceHistory: [
      { month: 'Jan', price: 600 },
      { month: 'Feb', price: 620 },
      { month: 'Mar', price: 630 },
      { month: 'Apr', price: 640 },
      { month: 'May', price: 650 },
      { month: 'Jun', price: 650 },
    ],
  },
  {
    id: '2',
    name: 'Sengkang Rivervale',
    address: 'Block 456B, #08-221, Sengkang East Avenue',
    pricePerSqft: 700,
    size: 950,
    type: PropertyType.HDB,
    roomType: '3-room',
    undervaluationScore: 5, // 5% below market
    coordinates: {
      latitude: 1.3644,
      longitude: 103.8890,
    },
    priceHistory: [
      { month: 'Jan', price: 680 },
      { month: 'Feb', price: 685 },
      { month: 'Mar', price: 690 },
      { month: 'Apr', price: 695 },
      { month: 'May', price: 700 },
      { month: 'Jun', price: 700 },
    ],
  },
  {
    id: '3',
    name: 'The Pinnacle @ Duxton',
    address: '1 Cantonment Road, #32-18',
    pricePerSqft: 1200,
    size: 1080,
    type: PropertyType.HDB,
    roomType: '5-room',
    undervaluationScore: -10, // 10% above market (overvalued)
    coordinates: {
      latitude: 1.2790,
      longitude: 103.8414,
    },
    priceHistory: [
      { month: 'Jan', price: 1150 },
      { month: 'Feb', price: 1160 },
      { month: 'Mar', price: 1170 },
      { month: 'Apr', price: 1180 },
      { month: 'May', price: 1190 },
      { month: 'Jun', price: 1200 },
    ],
  },
  {
    id: '4',
    name: 'Skyline Residences',
    address: '120 Telok Blangah Road, #15-77',
    pricePerSqft: 2200,
    size: 1500,
    type: PropertyType.PRIVATE,
    roomType: '3BR',
    undervaluationScore: 12, // 12% below market
    coordinates: {
      latitude: 1.2712,
      longitude: 103.8200,
    },
    priceHistory: [
      { month: 'Jan', price: 2100 },
      { month: 'Feb', price: 2120 },
      { month: 'Mar', price: 2140 },
      { month: 'Apr', price: 2160 },
      { month: 'May', price: 2180 },
      { month: 'Jun', price: 2200 },
    ],
  },
  {
    id: '5',
    name: 'Marina Bay Residences',
    address: '18 Marina Boulevard, #42-08',
    pricePerSqft: 3100,
    size: 2200,
    type: PropertyType.PRIVATE,
    roomType: '4BR',
    undervaluationScore: -15, // 15% above market (overvalued)
    coordinates: {
      latitude: 1.2821,
      longitude: 103.8539,
    },
    priceHistory: [
      { month: 'Jan', price: 2900 },
      { month: 'Feb', price: 2950 },
      { month: 'Mar', price: 3000 },
      { month: 'Apr', price: 3050 },
      { month: 'May', price: 3075 },
      { month: 'Jun', price: 3100 },
    ],
  },
  {
    id: '6',
    name: 'Punggol Emerald',
    address: 'Block 268C, #10-304, Punggol Field',
    pricePerSqft: 680,
    size: 1100,
    type: PropertyType.HDB,
    roomType: '4-room',
    undervaluationScore: 8, // 8% below market
    coordinates: {
      latitude: 1.3984,
      longitude: 103.9072,
    },
    priceHistory: [
      { month: 'Jan', price: 650 },
      { month: 'Feb', price: 660 },
      { month: 'Mar', price: 665 },
      { month: 'Apr', price: 670 },
      { month: 'May', price: 675 },
      { month: 'Jun', price: 680 },
    ],
  },
  {
    id: '7',
    name: 'Bishan Loft',
    address: 'Block 279A, #14-177, Bishan Street 24',
    pricePerSqft: 800,
    size: 1300,
    type: PropertyType.HDB,
    roomType: '5-room',
    undervaluationScore: 0, // fairly priced
    coordinates: {
      latitude: 1.3526,
      longitude: 103.8352,
    },
    priceHistory: [
      { month: 'Jan', price: 790 },
      { month: 'Feb', price: 792 },
      { month: 'Mar', price: 795 },
      { month: 'Apr', price: 797 },
      { month: 'May', price: 798 },
      { month: 'Jun', price: 800 },
    ],
  },
];

// Service functions
export const fetchProperties = async (): Promise<Property[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProperties);
    }, 500);
  });
};

export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const property = mockProperties.find((p) => p.id === id);
      resolve(property);
    }, 300);
  });
};

export const fetchPropertiesByType = async (type: PropertyType): Promise<Property[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProperties = mockProperties.filter((p) => p.type === type);
      resolve(filteredProperties);
    }, 300);
  });
};

export const fetchPropertiesByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<Property[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProperties = mockProperties.filter(
        (p) => p.pricePerSqft >= minPrice && p.pricePerSqft <= maxPrice
      );
      resolve(filteredProperties);
    }, 300);
  });
};