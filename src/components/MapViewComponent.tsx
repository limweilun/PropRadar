import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Region, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { styled } from 'nativewind';
import { Property, PropertyType } from '../types';
import { fetchProperties } from '../services/propertyService';
import { getMarkerCategory, getMarkerColor } from '../utils/formatting';
import { useFilterStore } from '../state/filterStore';

// Apply styled to React Native components
const StyledView = styled(View);
const StyledMapView = styled(MapView);

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
  
  return (
    <StyledView className="flex-1">
      <StyledMapView
        ref={mapRef}
        className="w-full h-full"
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {renderMarkers()}
      </StyledMapView>
    </StyledView>
  );
};