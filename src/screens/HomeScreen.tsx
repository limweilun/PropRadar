import React, { useState } from 'react';
import { View, Modal, SafeAreaView, StatusBar, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styled } from 'nativewind';
import { RootStackParamList } from '../navigation/types';
import { Property } from '../types';
import { MapViewComponent } from '../components/MapViewComponent';
import { FilterBar } from '../components/FilterBar';
import { PropertyDetails } from '../components/PropertyDetails';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const handleMarkerPress = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };
  
  return (
    <StyledSafeAreaView className="flex-1 bg-dark-900">
      <StatusBar barStyle="light-content" backgroundColor="rgba(18,18,18,0.9)" />
      
      <StyledView className="flex-1">
        {/* App Header */}
        <StyledView 
          className="bg-dark-700 px-4 pt-10 pb-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4
          }}>
          <StyledText className="text-2xl font-bold text-primary-400">PropRadar</StyledText>
          <StyledText className="text-sm text-gray-400 -mt-1">Find undervalued properties in Singapore</StyledText>
        </StyledView>
        
        <FilterBar />
        
        <MapViewComponent onMarkerPress={handleMarkerPress} />
        
        {/* Property Details Modal */}
        <Modal
          visible={showDetailsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseDetails}
        >
          <StyledView className="flex-1 justify-end bg-black bg-opacity-70">
            {selectedProperty && (
              <PropertyDetails
                property={selectedProperty}
                onClose={handleCloseDetails}
              />
            )}
          </StyledView>
        </Modal>
      </StyledView>
    </StyledSafeAreaView>
  );
};