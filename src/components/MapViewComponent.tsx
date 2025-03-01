import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Alert, Text } from 'react-native';
import MapView, { Marker, Region, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { styled } from 'nativewind';
import { Property, PropertyType } from '../types';
import { fetchProperties } from '../services/propertyService';
import { getMarkerCategory, getMarkerColor } from '../utils/formatting';
import { useFilterStore } from '../state/filterStore';
import * as Location from 'expo-location';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledMapView = styled(MapView);
const StyledText = styled(Text);

type MapViewComponentProps = {
  onMarkerPress: (property: Property) => void;
};

const initialRegion: Region = {
  latitude: 1.3521,
  longitude: 103.8198,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const MapViewComponent: React.FC<MapViewComponentProps> = ({ 
  onMarkerPress 
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const mapRef = useRef<MapView>(null);
  const { filter } = useFilterStore();
  
  // Fetch all properties
  useEffect(() => {
    const getProperties = async () => {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    getProperties();
  }, []);
  
  // Apply filters
  useEffect(() => {
    // Skip filtering if no properties are loaded yet
    if (properties.length === 0) return;
    
    let filtered = [...properties];
    
    // Filter by property type
    if (filter.propertyType !== 'ALL') {
      filtered = filtered.filter(p => p.type === filter.propertyType);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      p => p.pricePerSqft >= filter.priceRange[0] && p.pricePerSqft <= filter.priceRange[1]
    );
    
    // Filter by district (if implemented)
    if (filter.district) {
      // This would require district data in the properties
      // filtered = filtered.filter(p => p.district === filter.district);
    }
    
    setFilteredProperties(filtered);
  }, [properties, filter.propertyType, filter.priceRange, filter.district]);
  
  const renderMarkers = () => {
    return filteredProperties.map(property => {
      const category = getMarkerCategory(property.undervaluationScore);
      const markerColor = getMarkerColor(category);
      
      return (
        <Marker
          key={property.id}
          coordinate={property.coordinates}
          pinColor={markerColor}
          onPress={() => onMarkerPress(property)}
        />
      );
    });
  };
  
  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        if (mapRef.current && location) {
          const userRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          mapRef.current.animateToRegion(userRegion);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Create an error handler for map loading errors
  const [mapError, setMapError] = useState<string | null>(null);
  
  const handleMapError = (error: any) => {
    console.error('Map loading error:', error);
    setMapError('Failed to load map. Please check your API keys.');
  };
  
  // Create a fallback mechanism if Google Maps fails
  const [useAppleMaps, setUseAppleMaps] = useState(false);
  
  // Try to use Google Maps first, but fall back to Apple Maps if there's an error on iOS
  useEffect(() => {
    if (mapError && Platform.OS === 'ios') {
      setUseAppleMaps(true);
    }
  }, [mapError]);

  return (
    <StyledView className="flex-1">
      <StyledMapView
        ref={mapRef}
        className="w-full h-full"
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        onError={handleMapError}
      >
        {renderMarkers()}
      </StyledMapView>
      
      {mapError && Platform.OS === 'android' && (
        <StyledView className="absolute top-0 left-0 right-0 bg-red-500 p-2">
          <StyledText className="text-white text-center">{mapError}</StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};