import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { RootStackParamList, TabParamList } from './types';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme based on dark theme with professional PropTech colors
const PropRadarDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0EA5E9', // Modern blue - primary brand color
    background: '#0F172A', // Deep navy
    card: '#1E293B', // Slate dark
    text: '#E2E8F0', // Light gray
    border: '#334155', // Slate
    notification: '#38BDF8', // Light blue for notifications
  },
};

// Tab icons - using proper vector icons for professional look
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 26,
    height: 26
  }}>
    <MaterialIcons 
      name="map" 
      size={24} 
      color={focused ? '#38BDF8' : '#94A3B8'} 
    />
  </View>
);

const WatchlistIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 26,
    height: 26
  }}>
    <MaterialIcons 
      name="star" 
      size={24} 
      color={focused ? '#38BDF8' : '#94A3B8'} 
    />
  </View>
);

const InfoIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 26,
    height: 26
  }}>
    <MaterialIcons 
      name="info" 
      size={24} 
      color={focused ? '#38BDF8' : '#94A3B8'} 
    />
  </View>
);

// Home Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

// Watchlist Stack Navigator
const WatchlistStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Watchlist" component={WatchlistScreen} />
    </Stack.Navigator>
  );
};

// Tab Navigator
export const AppNavigator = () => {
  return (
    <NavigationContainer theme={PropRadarDarkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#38BDF8', // Light blue (active)
          tabBarInactiveTintColor: '#94A3B8', // Slate gray (inactive)
          tabBarStyle: {
            backgroundColor: '#1E293B', // Slate dark
            borderTopWidth: 0,
            elevation: 15,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            paddingBottom: 4,
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="WatchlistTab"
          component={WatchlistStack}
          options={{
            tabBarLabel: 'Watchlist',
            tabBarIcon: ({ focused }) => <WatchlistIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="InfoTab"
          component={InfoScreen}
          options={{
            tabBarLabel: 'Info',
            tabBarIcon: ({ focused }) => <InfoIcon focused={focused} />,
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};