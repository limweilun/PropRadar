import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { PropertyType } from '../types';
import { useFilterStore } from '../state/filterStore';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export const FilterBar: React.FC = () => {
  const { filter, setPropertyType, setPriceRange, resetFilters } = useFilterStore();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPrice, setMinPrice] = useState(filter.priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(filter.priceRange[1].toString());
  
  // Memoize filter type buttons to prevent unnecessary re-renders
  const isAllSelected = useMemo(() => filter.propertyType === 'ALL', [filter.propertyType]);
  const isHdbSelected = useMemo(() => filter.propertyType === PropertyType.HDB, [filter.propertyType]);
  const isPrivateSelected = useMemo(() => filter.propertyType === PropertyType.PRIVATE, [filter.propertyType]);
  
  // Use callbacks for filter type handlers to prevent recreating functions on each render
  const handleAllFilter = useCallback(() => setPropertyType('ALL'), [setPropertyType]);
  const handleHdbFilter = useCallback(() => setPropertyType(PropertyType.HDB), [setPropertyType]);
  const handlePrivateFilter = useCallback(() => setPropertyType(PropertyType.PRIVATE), [setPropertyType]);
  
  const toggleFilterModal = useCallback(() => {
    setShowFilterModal(!showFilterModal);
    if (!showFilterModal) {
      // Reset temp price range when opening modal
      setMinPrice(filter.priceRange[0].toString());
      setMaxPrice(filter.priceRange[1].toString());
    }
  }, [showFilterModal, filter.priceRange]);
  
  const applyFilters = useCallback(() => {
    const min = parseInt(minPrice, 10) || 0;
    const max = parseInt(maxPrice, 10) || 10000;
    setPriceRange([min, max]);
    setShowFilterModal(false);
  }, [minPrice, maxPrice, setPriceRange]);
  
  return (
    <StyledView 
      className="bg-dark-700 px-4 py-3 border-b border-dark-500 z-10"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3
      }}>
      <StyledView className="flex-row justify-between items-center">
        <StyledView className="flex-row space-x-2">
          <StyledTouchableOpacity
            className={isAllSelected 
              ? "px-4 py-2 rounded-full bg-primary-700" 
              : "px-4 py-2 rounded-full bg-dark-500"}
            onPress={handleAllFilter}
            activeOpacity={0.7}
            style={isAllSelected ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2
            } : {}}
          >
            <StyledText
              className={isAllSelected ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-300"}
            >
              All
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity
            className={isHdbSelected 
              ? "px-4 py-2 rounded-full bg-primary-700" 
              : "px-4 py-2 rounded-full bg-dark-500"}
            onPress={handleHdbFilter}
            activeOpacity={0.7}
            style={isHdbSelected ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2
            } : {}}
          >
            <StyledText
              className={isHdbSelected ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-300"}
            >
              HDB
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity
            className={isPrivateSelected 
              ? "px-4 py-2 rounded-full bg-primary-700" 
              : "px-4 py-2 rounded-full bg-dark-500"}
            onPress={handlePrivateFilter}
            activeOpacity={0.7}
            style={isPrivateSelected ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2
            } : {}}
          >
            <StyledText
              className={isPrivateSelected ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-300"}
            >
              Private
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        
        <StyledTouchableOpacity
          className="px-4 py-2 rounded-full bg-secondary-800 flex-row items-center"
          onPress={toggleFilterModal}
          activeOpacity={0.7}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2
          }}
        >
          <StyledText className="text-sm font-medium text-secondary-300 mr-1">Filters</StyledText>
          <StyledText>🔍</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={toggleFilterModal}
      >
        <StyledView className="flex-1 justify-end bg-black bg-opacity-70">
          <StyledView 
            className="bg-dark-700 rounded-t-xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5
            }}>
            <StyledView className="pb-4 mb-2 border-b border-dark-500">
              <StyledText className="text-xl font-bold text-center mb-1 text-gray-200">Property Filters</StyledText>
              <StyledTouchableOpacity
                onPress={() => resetFilters()}
                className="absolute right-0 top-0"
                activeOpacity={0.7}
              >
                <StyledText className="text-primary-400 font-medium">Reset</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            
            <StyledView className="py-4">
              <StyledText className="font-semibold text-lg mb-4 text-gray-200">Price Range (per sqft)</StyledText>
              
              <StyledView className="flex-row items-center justify-between">
                <StyledView className="flex-1 mr-2">
                  <StyledText className="text-sm text-gray-400 mb-1 font-medium">Minimum (S$)</StyledText>
                  <StyledTextInput
                    className="border border-dark-400 rounded-lg px-4 py-3 bg-dark-600"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="0"
                    placeholderTextColor="#6E6E6E"
                    style={{ color: '#E5E7EB' }}
                  />
                </StyledView>
                
                <StyledView className="flex-1 ml-2">
                  <StyledText className="text-sm text-gray-400 mb-1 font-medium">Maximum (S$)</StyledText>
                  <StyledTextInput
                    className="border border-dark-400 rounded-lg px-4 py-3 bg-dark-600"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholder="10000"
                    placeholderTextColor="#6E6E6E"
                    style={{ color: '#E5E7EB' }}
                  />
                </StyledView>
              </StyledView>
              
              <StyledView className="mt-4 bg-primary-900 p-3 rounded-lg">
                <StyledText className="text-sm text-primary-300 font-medium">
                  Current range: S${filter.priceRange[0]} - S${filter.priceRange[1]}
                </StyledText>
              </StyledView>
            </StyledView>
            
            <StyledView className="flex-row space-x-3 pt-4">
              <StyledTouchableOpacity
                className="flex-1 py-3 rounded-xl bg-dark-500"
                onPress={toggleFilterModal}
                activeOpacity={0.7}
              >
                <StyledText className="text-center font-semibold text-gray-300">Cancel</StyledText>
              </StyledTouchableOpacity>
              
              <StyledTouchableOpacity
                className="flex-1 py-3 rounded-xl bg-primary-700 shadow-sm"
                onPress={applyFilters}
                activeOpacity={0.7}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 3
                }}
              >
                <StyledText className="text-center font-semibold text-white">Apply Filters</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};