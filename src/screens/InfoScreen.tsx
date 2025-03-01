import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type InfoScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const InfoScreen: React.FC<InfoScreenProps> = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" style={{ paddingTop: 50 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-text mb-2">About this App</Text>
        <Text className="text-base text-lightText mb-6">
          SmartProperty Finder SG helps you discover potentially undervalued properties in Singapore
        </Text>
        
        <View className="bg-white rounded-xl p-4 mb-6" style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}>
          <Text className="text-lg font-bold text-text mb-2">How We Calculate Undervaluation</Text>
          <Text className="text-base text-lightText mb-3">
            Properties are categorized as:
          </Text>
          
          <View className="flex-row items-center mb-2">
            <View className="w-4 h-4 rounded-full bg-undervalued mr-2" />
            <Text className="text-base text-text">
              <Text className="font-bold">Undervalued</Text> (10%+ below median prices)
            </Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <View className="w-4 h-4 rounded-full bg-fairvalue mr-2" />
            <Text className="text-base text-text">
              <Text className="font-bold">Fair Value</Text> (within ±5% of median prices)
            </Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-overvalued mr-2" />
            <Text className="text-base text-text">
              <Text className="font-bold">Overvalued</Text> (10%+ above median prices)
            </Text>
          </View>
          
          <Text className="text-base text-lightText">
            We compare listing prices with the median price per square foot for properties
            of the same type in the same district over the last 6 months.
          </Text>
        </View>
        
        <View className="bg-white rounded-xl p-4 mb-6" style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}>
          <Text className="text-lg font-bold text-text mb-2">Data Sources</Text>
          <Text className="text-base text-lightText mb-1">
            • Public HDB resale data from data.gov.sg
          </Text>
          <Text className="text-base text-lightText mb-1">
            • URA private property transaction data
          </Text>
          <Text className="text-base text-lightText">
            Data is updated daily to provide the most current market insights.
          </Text>
        </View>
        
        <View className="bg-white rounded-xl p-4" style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}>
          <Text className="text-lg font-bold text-text mb-2">Disclaimer</Text>
          <Text className="text-base text-lightText">
            This app is for informational purposes only and should not be considered 
            financial advice. Always conduct your own due diligence and consult with
            real estate professionals before making property investment decisions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};