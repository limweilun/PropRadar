import React, { useState } from 'react';
import { View, Text, FlatList, Modal, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWatchlistStore } from '../state/watchlistStore';
import { WatchlistItem } from '../components/WatchlistItem';
import { PropertyDetails } from '../components/PropertyDetails';
import { Property } from '../types';

type WatchlistScreenProps = NativeStackScreenProps<RootStackParamList, 'Watchlist'>;

export const WatchlistScreen: React.FC<WatchlistScreenProps> = () => {
  const { watchlist } = useWatchlistStore();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const handleItemPress = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-background" style={{ paddingTop: 50 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-2">Watchlist</Text>
        <Text className="text-base text-lightText mb-4">
          Properties you're keeping an eye on
        </Text>
      </View>
      
      {watchlist.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-lightText text-center">
            You haven't added any properties to your watchlist yet.
          </Text>
          <Text className="text-base text-lightText text-center mt-2">
            Tap the star icon on any property to add it to your watchlist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.property.id}
          renderItem={({ item }) => (
            <View className="px-4">
              <WatchlistItem
                item={item}
                onPress={() => handleItemPress(item.property)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      
      {/* Property Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseDetails}
      >
        <View className="flex-1 justify-end bg-black/50">
          {selectedProperty && (
            <PropertyDetails
              property={selectedProperty}
              onClose={handleCloseDetails}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};