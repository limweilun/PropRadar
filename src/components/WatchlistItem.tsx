import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WatchlistItem as WatchlistItemType } from '../types';
import { formatDate, formatPsf, formatPropertyType, getUndervaluationText } from '../utils/formatting';
import { useWatchlistStore } from '../state/watchlistStore';
import { styled } from 'nativewind';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Apply styled to components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
  
  // Get color and icon based on undervaluation score
  const getScoreInfo = () => {
    if (property.undervaluationScore >= 10) {
      return { 
        color: 'text-green-500',
        bgColor: 'bg-green-900',
        icon: 'trending-down',
        iconColor: '#10B981'
      };
    }
    if (property.undervaluationScore <= -10) {
      return { 
        color: 'text-red-500',
        bgColor: 'bg-red-900',
        icon: 'trending-up',
        iconColor: '#EF4444'
      };
    }
    return { 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-900',
      icon: 'trending-neutral',
      iconColor: '#F59E0B'
    };
  };
  
  const scoreInfo = getScoreInfo();
  const hasUnreadAlerts = item.alerts.some(alert => !alert.read);
  const alertCount = item.alerts.filter(a => !a.read).length;
  
  return (
    <StyledTouchableOpacity
      className="bg-dark-700 rounded-xl overflow-hidden border border-dark-500"
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
      }}
    >
      {/* Header */}
      <StyledView className="p-4">
        <StyledView className="flex-row justify-between items-start">
          <StyledView className="flex-1">
            <StyledText className="text-lg font-bold text-gray-100" numberOfLines={1}>
              {property.name}
            </StyledText>
            <StyledText className="text-sm text-gray-400" numberOfLines={1}>
              {property.address}
            </StyledText>
          </StyledView>
          
          {hasUnreadAlerts && (
            <StyledView className="bg-red-500 rounded-full h-7 w-7 items-center justify-center ml-2">
              <StyledText className="text-xs text-white font-bold">
                {alertCount}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      </StyledView>
      
      {/* Stats Area */}
      <StyledView className="flex-row bg-dark-600 px-4 py-3">
        <StyledView className="flex-1 border-r border-dark-500 pr-4">
          <StyledView className="flex-row items-center">
            <MaterialIcons name="attach-money" size={14} color="#9CA3AF" style={{ marginRight: 3 }} />
            <StyledText className="text-xs text-gray-400 uppercase">Price</StyledText>
          </StyledView>
          <StyledText className="text-base font-semibold text-gray-200 mt-1">
            {formatPsf(property.pricePerSqft)}
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-1 border-r border-dark-500 px-4">
          <StyledView className="flex-row items-center">
            <MaterialIcons name="home" size={14} color="#9CA3AF" style={{ marginRight: 3 }} />
            <StyledText className="text-xs text-gray-400 uppercase">Type</StyledText>
          </StyledView>
          <StyledText className="text-base font-semibold text-gray-200 mt-1">
            {formatPropertyType(property)}
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-1 pl-4">
          <StyledView className="flex-row items-center">
            <MaterialCommunityIcons name={scoreInfo.icon} size={14} color="#9CA3AF" style={{ marginRight: 3 }} />
            <StyledText className="text-xs text-gray-400 uppercase">Value</StyledText>
          </StyledView>
          <StyledText className={`text-base font-semibold ${scoreInfo.color} mt-1`}>
            {getUndervaluationText(property.undervaluationScore)}
          </StyledText>
        </StyledView>
      </StyledView>
      
      {/* Footer */}
      <StyledView className="flex-row justify-between items-center p-3 bg-dark-700">
        <StyledText className="text-xs text-gray-400">
          Added {formatDate(item.addedAt)}
        </StyledText>
        
        <StyledView className="flex-row">
          {item.alerts.length > 0 && (
            <StyledTouchableOpacity
              className="flex-row items-center mr-4"
              onPress={handleClearAlerts}
            >
              <MaterialIcons name="notifications-off" size={14} color="#60A5FA" style={{ marginRight: 3 }} />
              <StyledText className="text-xs text-primary-400">Clear</StyledText>
            </StyledTouchableOpacity>
          )}
          
          <StyledTouchableOpacity 
            className="flex-row items-center" 
            onPress={handleRemove}
          >
            <MaterialIcons name="delete-outline" size={14} color="#EF4444" style={{ marginRight: 3 }} />
            <StyledText className="text-xs text-red-500">Remove</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
      
      {/* Valuation Status Indicator */}
      <StyledView 
        className={`h-1 w-full ${scoreInfo.bgColor}`} 
        style={{ position: 'absolute', top: 0 }} 
      />
    </StyledTouchableOpacity>
  );
};