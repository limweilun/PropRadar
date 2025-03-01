import React, { useState } from 'react';
import { View, Text, FlatList, Modal, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWatchlistStore } from '../state/watchlistStore';
import { WatchlistItem } from '../components/WatchlistItem';
import { PropertyDetails } from '../components/PropertyDetails';
import { Property } from '../types';
import { styled } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons';

// Apply styled to components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledFlatList = styled(FlatList);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

type WatchlistScreenProps = NativeStackScreenProps<RootStackParamList, 'Watchlist'>;

export const WatchlistScreen: React.FC<WatchlistScreenProps> = () => {
  const { watchlist, clearAllWatchlistAlerts } = useWatchlistStore();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const handleItemPress = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };

  const totalAlerts = watchlist.reduce((sum, item) => sum + item.alerts.filter(a => !a.read).length, 0);
  
  const handleClearAllAlerts = () => {
    if (totalAlerts > 0) {
      // This function would need to be added to watchlistStore
      if (clearAllWatchlistAlerts) {
        clearAllWatchlistAlerts();
      }
    }
  };
  
  return (
    <StyledSafeAreaView className="flex-1 bg-dark-800" style={{ paddingTop: 50 }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <StyledView className="px-5 py-4">
        <StyledView className="flex-row justify-between items-center mb-2">
          <StyledText className="text-3xl font-bold text-gray-100">Watchlist</StyledText>
          
          {totalAlerts > 0 && (
            <StyledTouchableOpacity 
              className="flex-row items-center bg-dark-600 px-3 py-2 rounded-lg border border-dark-500"
              onPress={handleClearAllAlerts}
              activeOpacity={0.7}
            >
              <StyledText className="text-primary-400 text-sm font-medium mr-1">Clear All Alerts</StyledText>
              <MaterialIcons name="notifications-off" size={16} color="#60A5FA" />
            </StyledTouchableOpacity>
          )}
        </StyledView>
        
        <StyledText className="text-base text-gray-300 mb-4">
          Track your favorite properties and price changes
        </StyledText>
      </StyledView>
      
      {watchlist.length === 0 ? (
        <StyledView className="flex-1 justify-center items-center p-6">
          <StyledView className="bg-dark-700 p-6 rounded-2xl border border-dark-500 items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
              maxWidth: 300
            }}>
            <MaterialIcons name="star-border" size={48} color="#60A5FA" style={{ marginBottom: 16 }} />
            
            <StyledText className="text-xl font-bold text-gray-200 text-center mb-3">
              Your Watchlist is Empty
            </StyledText>
            
            <StyledText className="text-base text-gray-300 text-center mb-4">
              Add properties to your watchlist to monitor price changes and market status
            </StyledText>
            
            <StyledView className="bg-dark-600 rounded-xl p-4 w-full">
              <StyledText className="text-sm text-gray-300 mb-1">
                <StyledText className="font-bold">Tip:</StyledText> Tap the star icon on any property details page to add it to your watchlist
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      ) : (
        <StyledFlatList
          data={watchlist}
          keyExtractor={(item) => item.property.id}
          renderItem={({ item }) => (
            <StyledView className="px-4 mb-3">
              <WatchlistItem
                item={item}
                onPress={() => handleItemPress(item.property)}
              />
            </StyledView>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Property Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseDetails}
      >
        <StyledView className="flex-1 justify-end bg-black/60">
          {selectedProperty && (
            <PropertyDetails
              property={selectedProperty}
              onClose={handleCloseDetails}
            />
          )}
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};