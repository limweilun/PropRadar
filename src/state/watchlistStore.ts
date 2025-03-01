import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, WatchlistAlert, WatchlistItem } from '../types';

interface WatchlistState {
  watchlist: WatchlistItem[];
  addToWatchlist: (property: Property) => void;
  removeFromWatchlist: (propertyId: string) => void;
  isInWatchlist: (propertyId: string) => boolean;
  addAlert: (propertyId: string, alert: Omit<WatchlistAlert, 'id'>) => void;
  markAlertAsRead: (propertyId: string, alertId: string) => void;
  clearAllAlerts: (propertyId: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      
      addToWatchlist: (property: Property) => {
        const { watchlist } = get();
        // Check if property is already in watchlist
        if (watchlist.some((item) => item.property.id === property.id)) {
          return;
        }
        
        // Add property to watchlist with empty alerts
        set({
          watchlist: [
            ...watchlist,
            {
              property,
              addedAt: new Date(),
              alerts: [],
            },
          ],
        });
      },
      
      removeFromWatchlist: (propertyId: string) => {
        const { watchlist } = get();
        set({
          watchlist: watchlist.filter((item) => item.property.id !== propertyId),
        });
      },
      
      isInWatchlist: (propertyId: string) => {
        const { watchlist } = get();
        return watchlist.some((item) => item.property.id === propertyId);
      },
      
      addAlert: (propertyId: string, alert: Omit<WatchlistAlert, 'id'>) => {
        const { watchlist } = get();
        
        set({
          watchlist: watchlist.map((item) => {
            if (item.property.id === propertyId) {
              return {
                ...item,
                alerts: [
                  ...item.alerts,
                  {
                    ...alert,
                    id: Math.random().toString(36).substring(2, 9), // Simple ID generation
                  },
                ],
              };
            }
            return item;
          }),
        });
      },
      
      markAlertAsRead: (propertyId: string, alertId: string) => {
        const { watchlist } = get();
        
        set({
          watchlist: watchlist.map((item) => {
            if (item.property.id === propertyId) {
              return {
                ...item,
                alerts: item.alerts.map((alert) => {
                  if (alert.id === alertId) {
                    return {
                      ...alert,
                      read: true,
                    };
                  }
                  return alert;
                }),
              };
            }
            return item;
          }),
        });
      },
      
      clearAllAlerts: (propertyId: string) => {
        const { watchlist } = get();
        
        set({
          watchlist: watchlist.map((item) => {
            if (item.property.id === propertyId) {
              return {
                ...item,
                alerts: [],
              };
            }
            return item;
          }),
        });
      },
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);