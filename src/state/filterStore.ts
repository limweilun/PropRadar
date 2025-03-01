import { create } from 'zustand';
import { PropertyFilter, PropertyType } from '../types';

interface FilterState {
  filter: PropertyFilter;
  setPropertyType: (type: PropertyType | 'ALL') => void;
  setPriceRange: (range: [number, number]) => void;
  setDistrict: (district: string | undefined) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTER: PropertyFilter = {
  propertyType: 'ALL',
  priceRange: [0, 5000], // SGD per sqft
  district: undefined,
};

export const useFilterStore = create<FilterState>((set) => ({
  filter: DEFAULT_FILTER,
  
  setPropertyType: (type: PropertyType | 'ALL') => {
    // Skip update if type is already selected (prevents unnecessary re-renders)
    set((state) => {
      if (state.filter.propertyType === type) {
        return state;
      }
      return {
        filter: {
          ...state.filter,
          propertyType: type,
        },
      };
    });
  },
  
  setPriceRange: (range: [number, number]) => {
    set((state) => ({
      filter: {
        ...state.filter,
        priceRange: range,
      },
    }));
  },
  
  setDistrict: (district: string | undefined) => {
    set((state) => ({
      filter: {
        ...state.filter,
        district,
      },
    }));
  },
  
  resetFilters: () => {
    set({
      filter: DEFAULT_FILTER,
    });
  },
}));