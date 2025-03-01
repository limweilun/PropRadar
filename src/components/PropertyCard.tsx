import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { Property } from '../types';
import { formatPsf, formatPropertyType, formatSize, getUndervaluationText } from '../utils/formatting';
import { useWatchlistStore } from '../state/watchlistStore';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

type PropertyCardProps = {
  property: Property;
  onPress?: () => void;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(property.id);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(property.id);
    } else {
      addToWatchlist(property);
    }
  };

  // Determine the color based on undervaluation score
  const getScoreColor = () => {
    if (property.undervaluationScore >= 10) return 'text-green-500';
    if (property.undervaluationScore <= -10) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getTrendIndicator = () => {
    if (property.undervaluationScore >= 10) return '↓ '; // Downward trend = potentially undervalued
    if (property.undervaluationScore <= -10) return '↑ '; // Upward trend = potentially overvalued
    return '→ '; // Neutral
  };

  return (
    <StyledTouchableOpacity
      className="bg-dark-700 rounded-card p-5 mb-4 w-full border border-dark-600"
      onPress={onPress}
      activeOpacity={0.7}
      style={{ 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
      }}
    >
      <StyledView className="flex-row justify-between items-start">
        <StyledView className="flex-1">
          <StyledText className="text-xl font-bold text-gray-200" numberOfLines={1}>
            {property.name}
          </StyledText>
          <StyledText className="text-sm text-gray-400 mt-1" numberOfLines={1}>
            {property.address}
          </StyledText>
        </StyledView>
        
        <StyledTouchableOpacity
          className={inWatchlist 
            ? "ml-2 p-2 rounded-full bg-primary-900" 
            : "ml-2 p-2 rounded-full bg-dark-500"}
          onPress={toggleWatchlist}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2
          }}
        >
          <StyledText 
            className={inWatchlist ? "text-primary-400 text-base" : "text-gray-400 text-base"}
            style={{ fontWeight: inWatchlist ? 'bold' : 'normal' }}
          >
            {inWatchlist ? '★' : '☆'}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledView className="flex-row justify-between mt-5 p-3 bg-dark-600 rounded-xl">
        <StyledView className="flex-1">
          <StyledText className="text-xs font-medium text-gray-400">PRICE/SQFT</StyledText>
          <StyledText className="text-base font-bold text-gray-200 mt-1">
            {formatPsf(property.pricePerSqft)}
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-1">
          <StyledText className="text-xs font-medium text-gray-400">SIZE</StyledText>
          <StyledText className="text-base font-bold text-gray-200 mt-1">
            {formatSize(property.size)}
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-1">
          <StyledText className="text-xs font-medium text-gray-400">TYPE</StyledText>
          <StyledText className="text-base font-bold text-gray-200 mt-1">
            {formatPropertyType(property)}
          </StyledText>
        </StyledView>
      </StyledView>
      
      <StyledView className="mt-5 pt-4 border-t border-dark-600">
        <StyledView className="flex-row justify-between items-center">
          <StyledView className="flex-1">
            <StyledText className="text-xs font-medium text-gray-400 mb-1">VALUATION</StyledText>
            <StyledText className={`text-lg font-bold ${getScoreColor()}`}>
              {getTrendIndicator()}{getUndervaluationText(property.undervaluationScore)}
            </StyledText>
          </StyledView>
          
          <StyledView className="flex-1 items-end justify-center">
            <StyledText className="text-xs font-medium text-gray-400 mb-1">6-MONTH TREND</StyledText>
            <StyledText className="text-sm font-semibold text-gray-300">
              {property.priceHistory.length > 0 ? 
                `S$${property.priceHistory[0].price} → S$${property.priceHistory[property.priceHistory.length-1].price}` : 
                'No price history'}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );
};