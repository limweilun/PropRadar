import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme based on dark theme
const PropRadarDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#7C3AED',
    background: '#121212',
    card: '#242424',
    text: '#E5E7EB',
    border: '#323232',
    notification: '#A78BFA',
  },
};

// Tab icons - using a more professional emoji set with consistent styling
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: focused ? '#4C1D95' : 'transparent',
    borderRadius: 6,
    padding: 3
  }}>
    <Text style={{ 
      fontSize: 16, 
      color: focused ? '#A78BFA' : '#9CA3AF',
      fontWeight: focused ? 'bold' : 'normal',
    }}>🏠</Text>
  </View>
);

const WatchlistIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: focused ? '#4C1D95' : 'transparent',
    borderRadius: 6,
    padding: 3
  }}>
    <Text style={{ 
      fontSize: 16, 
      color: focused ? '#A78BFA' : '#9CA3AF',
      fontWeight: focused ? 'bold' : 'normal',
    }}>⭐</Text>
  </View>
);

const InfoIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: focused ? '#4C1D95' : 'transparent',
    borderRadius: 6,
    padding: 3
  }}>
    <Text style={{ 
      fontSize: 16, 
      color: focused ? '#A78BFA' : '#9CA3AF',
      fontWeight: focused ? 'bold' : 'normal',
    }}>ℹ️</Text>
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
          tabBarActiveTintColor: '#A78BFA',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#242424',
            borderTopWidth: 0,
            elevation: 15,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            paddingTop: 8,
            paddingBottom: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
            marginBottom: 3,
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