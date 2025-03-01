import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WatchlistItem as WatchlistItemType } from '../types';
import { formatDate, formatPsf, formatPropertyType, getUndervaluationText } from '../utils/formatting';
import { useWatchlistStore } from '../state/watchlistStore';

type WatchlistItemProps = {
  item: WatchlistItemType;
  onPress: () => void;
};

export const WatchlistItem: React.FC<WatchlistItemProps> = ({ item, onPress }) => {
  const { removeFromWatchlist, clearAllAlerts } = useWatchlistStore();
  const { property } = item;
  
  const handleRemove = () => {
    removeFromWatchlist(property.id);
  };
  
  const handleClearAlerts = () => {
    clearAllAlerts(property.id);
  };
  
  // Get color based on undervaluation score
  const getScoreColor = () => {
    if (property.undervaluationScore >= 10) return 'text-undervalued';
    if (property.undervaluationScore <= -10) return 'text-overvalued';
    return 'text-fairvalue';
  };
  
  const hasUnreadAlerts = item.alerts.some(alert => !alert.read);
  
  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-text" numberOfLines={1}>
            {property.name}
          </Text>
          <Text className="text-sm text-lightText" numberOfLines={1}>
            {property.address}
          </Text>
        </View>
        
        {hasUnreadAlerts && (
          <View className="bg-red-500 rounded-full h-6 w-6 items-center justify-center">
            <Text className="text-xs text-white font-bold">
              {item.alerts.filter(a => !a.read).length}
            </Text>
          </View>
        )}
      </View>
      
      <View className="flex-row justify-between mt-3">
        <View>
          <Text className="text-xs text-lightText">PRICE</Text>
          <Text className="text-base font-semibold text-text">
            {formatPsf(property.pricePerSqft)}
          </Text>
        </View>
        
        <View>
          <Text className="text-xs text-lightText">TYPE</Text>
          <Text className="text-base font-semibold text-text">
            {formatPropertyType(property)}
          </Text>
        </View>
        
        <View>
          <Text className="text-xs text-lightText">VALUATION</Text>
          <Text className={`text-base font-semibold ${getScoreColor()}`}>
            {getUndervaluationText(property.undervaluationScore)}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
        <Text className="text-xs text-lightText">
          Added on {formatDate(item.addedAt)}
        </Text>
        
        <View className="flex-row">
          {item.alerts.length > 0 && (
            <TouchableOpacity
              className="mr-3"
              onPress={handleClearAlerts}
            >
              <Text className="text-xs text-primary">Clear Alerts</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleRemove}>
            <Text className="text-xs text-red-500">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};