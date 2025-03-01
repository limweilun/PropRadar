import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Property } from '../types';
import { formatPsf, formatPropertyType, formatSize, getUndervaluationText } from '../utils/formatting';
import { useWatchlistStore } from '../state/watchlistStore';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

type PropertyDetailsProps = {
  property: Property;
  onClose: () => void;
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onClose }) => {
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

  // Format price history data for display
  const renderPriceHistory = () => {
    if (!property.priceHistory || property.priceHistory.length === 0) {
      return <StyledText className="text-gray-400 italic p-4 text-center">No price history available</StyledText>;
    }

    return (
      <StyledView className="p-4 bg-dark-600 rounded-xl shadow-sm border border-dark-500">
        <StyledView className="flex-row justify-between mb-3 border-b border-dark-500 pb-2">
          <StyledText className="text-sm font-medium text-gray-400">Month</StyledText>
          <StyledText className="text-sm font-medium text-gray-400">Price (per sqft)</StyledText>
        </StyledView>
        
        {property.priceHistory.map((point, index) => (
          <StyledView 
            key={index} 
            className={`flex-row justify-between py-2 ${index !== property.priceHistory.length - 1 ? "border-b border-dark-500" : ""}`}
          >
            <StyledText className="text-gray-300 font-medium">{point.month}</StyledText>
            <StyledText className="text-gray-200 font-bold">S${point.price}</StyledText>
          </StyledView>
        ))}
      </StyledView>
    );
  };

  // Get confidence badge color
  const getConfidenceBadgeColor = () => {
    switch(property.valuationConfidence) {
      case 'Very High': return 'bg-green-800 text-green-100';
      case 'High': return 'bg-green-700 text-green-100';
      case 'Medium': return 'bg-yellow-600 text-yellow-100';
      case 'Low': return 'bg-red-600 text-red-100';
      default: return 'bg-dark-500 text-gray-300';
    }
  };

  return (
    <StyledView className="bg-dark-700 rounded-t-xl shadow-xl p-6 pt-3">
      <StyledView className="w-16 h-1 bg-dark-400 rounded-full mx-auto mb-5" />
      
      <StyledScrollView className="max-h-96">
        <StyledView className="flex-row justify-between items-start mb-4">
          <StyledView className="flex-1">
            <StyledText className="text-2xl font-bold text-gray-200">{property.name}</StyledText>
            <StyledText className="text-base text-gray-400 mt-1">{property.address}</StyledText>
          </StyledView>
          
          <StyledTouchableOpacity
            className={inWatchlist 
              ? "p-3 rounded-full bg-primary-900" 
              : "p-3 rounded-full bg-dark-500"}
            onPress={toggleWatchlist}
            activeOpacity={0.7}
            style={{
              width: 46,
              height: 46,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 3
            }}
          >
            <StyledText 
              className={inWatchlist ? "text-xl text-primary-400" : "text-xl text-gray-400"}
              style={{ fontWeight: inWatchlist ? 'bold' : 'normal' }}
            >
              {inWatchlist ? '★' : '☆'}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        
        <StyledView 
          className="flex-row justify-between mb-6 bg-dark-600 p-5 rounded-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 2
          }}>
          <StyledView>
            <StyledText className="text-xs font-medium text-gray-400">PRICE PER SQ FT</StyledText>
            <StyledText className="text-lg font-bold text-gray-200 mt-1">
              {formatPsf(property.pricePerSqft)}
            </StyledText>
          </StyledView>
          
          <StyledView>
            <StyledText className="text-xs font-medium text-gray-400">SIZE</StyledText>
            <StyledText className="text-lg font-bold text-gray-200 mt-1">
              {formatSize(property.size)}
            </StyledText>
          </StyledView>
          
          <StyledView>
            <StyledText className="text-xs font-medium text-gray-400">TYPE</StyledText>
            <StyledText className="text-lg font-bold text-gray-200 mt-1">
              {formatPropertyType(property)}
            </StyledText>
          </StyledView>
        </StyledView>
        
        <StyledView className="mb-6 p-5 border border-dark-500 rounded-xl bg-dark-600">
          <StyledView className="flex-row justify-between items-center mb-2">
            <StyledText className="text-lg font-bold text-gray-200">Valuation Analysis</StyledText>
            {property.valuationConfidence && (
              <StyledView className={`px-3 py-1 rounded-full ${getConfidenceBadgeColor()}`}>
                <StyledText className="text-xs font-semibold">{property.valuationConfidence} Confidence</StyledText>
              </StyledView>
            )}
          </StyledView>
          <StyledText className={`text-2xl font-bold mb-3 ${getScoreColor()}`}>
            {getTrendIndicator()}{getUndervaluationText(property.undervaluationScore)}
          </StyledText>
          <StyledText className="text-sm leading-5 text-gray-300 bg-dark-500 p-3 rounded-lg">
            {property.undervaluationScore > 0
              ? `This property is priced ${property.undervaluationScore.toFixed(1)}% below similar properties in the area, suggesting it might be undervalued.`
              : property.undervaluationScore < 0
              ? `This property is priced ${Math.abs(property.undervaluationScore).toFixed(1)}% above similar properties in the area, suggesting it might be overvalued.`
              : 'This property is priced at market value compared to similar properties in the area.'}
          </StyledText>
          
          {property.additionalDetails && (
            <StyledView className="mt-4 pt-3 border-t border-dark-400">
              {property.additionalDetails.floorCategory && (
                <StyledView className="flex-row items-center mb-2">
                  <StyledView className="w-2 h-2 rounded-full bg-dark-300 mr-2" />
                  <StyledText className="text-xs text-gray-300">
                    {property.additionalDetails.floorCategory} ({property.additionalDetails.floorLevel || '?'} floor)
                  </StyledText>
                </StyledView>
              )}
              
              {property.additionalDetails.remainingLease !== undefined && (
                <StyledView className="flex-row items-center mb-2">
                  <StyledView className="w-2 h-2 rounded-full bg-dark-300 mr-2" />
                  <StyledText className="text-xs text-gray-300">
                    Approx. {property.additionalDetails.remainingLease} years lease remaining
                  </StyledText>
                </StyledView>
              )}
              
              {property.additionalDetails.mrtProximity !== undefined && (
                <StyledView className="flex-row items-center mb-2">
                  <StyledView className="w-2 h-2 rounded-full bg-dark-300 mr-2" />
                  <StyledText className="text-xs text-gray-300">
                    MRT accessibility: {property.additionalDetails.mrtProximity}/10
                  </StyledText>
                </StyledView>
              )}
              
              {property.additionalDetails.comparableCount !== undefined && (
                <StyledView className="flex-row items-center mb-2">
                  <StyledView className="w-2 h-2 rounded-full bg-dark-300 mr-2" />
                  <StyledText className="text-xs text-gray-300">
                    Based on {property.additionalDetails.comparableCount} comparable properties
                  </StyledText>
                </StyledView>
              )}
            </StyledView>
          )}
        </StyledView>
        
        <StyledView className="mb-5">
          <StyledText className="text-lg font-bold mb-3 text-gray-200">6-Month Price Trend</StyledText>
          {renderPriceHistory()}
        </StyledView>
      </StyledScrollView>
      
      <StyledView className="mt-5 pt-5 border-t border-dark-500">
        <StyledTouchableOpacity
          className="py-4 bg-primary-700 rounded-xl"
          onPress={toggleWatchlist}
          activeOpacity={0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4
          }}
        >
          <StyledText className="text-white font-bold text-center text-base">
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity
          className="py-4 mt-3"
          onPress={onClose}
          activeOpacity={0.6}
        >
          <StyledText className="text-center text-gray-400 font-semibold">Close</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};