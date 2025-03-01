import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styled } from 'nativewind';

// Apply styled to components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

type InfoScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const InfoScreen: React.FC<InfoScreenProps> = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-dark-800" style={{ paddingTop: 50 }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <StyledScrollView className="flex-1 px-5 py-4">
        <StyledText className="text-3xl font-bold text-gray-100 mb-2">PropRadar</StyledText>
        <StyledText className="text-lg text-gray-300 mb-6">
          Find undervalued properties across Singapore with powerful data-driven insights
        </StyledText>
        
        <StyledView className="bg-dark-700 rounded-2xl p-5 mb-6 border border-dark-500" 
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8
          }}>
          <StyledText className="text-xl font-bold text-gray-100 mb-3">Smart Valuation Technology</StyledText>
          
          <StyledView className="bg-dark-600 rounded-xl p-4 mb-4">
            <StyledText className="text-base text-gray-200 leading-6 mb-4">
              Our advanced algorithm analyzes multiple factors to identify property opportunities:
            </StyledText>
            
            <StyledView className="mb-3">
              <StyledText className="text-base font-semibold text-gray-200 mb-1">• Price Comparison</StyledText>
              <StyledText className="text-sm text-gray-300 ml-4">
                Compares price per square foot against similar properties
              </StyledText>
            </StyledView>
            
            <StyledView className="mb-3">
              <StyledText className="text-base font-semibold text-gray-200 mb-1">• Floor Level Analysis</StyledText>
              <StyledText className="text-sm text-gray-300 ml-4">
                Accounts for premium typically paid for higher floors
              </StyledText>
            </StyledView>
            
            <StyledView className="mb-3">
              <StyledText className="text-base font-semibold text-gray-200 mb-1">• Remaining Lease</StyledText>
              <StyledText className="text-sm text-gray-300 ml-4">
                Considers lease duration impact on property value
              </StyledText>
            </StyledView>
            
            <StyledView className="mb-1">
              <StyledText className="text-base font-semibold text-gray-200 mb-1">• Location Value</StyledText>
              <StyledText className="text-sm text-gray-300 ml-4">
                Factors in MRT proximity and neighborhood amenities
              </StyledText>
            </StyledView>
          </StyledView>
          
          <StyledText className="text-lg font-bold text-gray-100 mb-3">Property Status Guide</StyledText>
          
          <StyledView className="flex-row items-center mb-3 bg-dark-600 p-3 rounded-lg">
            <StyledView className="w-5 h-5 rounded-full bg-green-500 mr-3" />
            <StyledView className="flex-1">
              <StyledText className="font-bold text-green-400 text-base">Undervalued</StyledText>
              <StyledText className="text-gray-300 text-sm">
                10%+ below comparable properties
              </StyledText>
            </StyledView>
          </StyledView>
          
          <StyledView className="flex-row items-center mb-3 bg-dark-600 p-3 rounded-lg">
            <StyledView className="w-5 h-5 rounded-full bg-yellow-500 mr-3" />
            <StyledView className="flex-1">
              <StyledText className="font-bold text-yellow-400 text-base">Fair Value</StyledText>
              <StyledText className="text-gray-300 text-sm">
                Within ±10% of market value
              </StyledText>
            </StyledView>
          </StyledView>
          
          <StyledView className="flex-row items-center mb-3 bg-dark-600 p-3 rounded-lg">
            <StyledView className="w-5 h-5 rounded-full bg-red-500 mr-3" />
            <StyledView className="flex-1">
              <StyledText className="font-bold text-red-400 text-base">Overvalued</StyledText>
              <StyledText className="text-gray-300 text-sm">
                10%+ above comparable properties
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        
        <StyledView className="bg-dark-700 rounded-2xl p-5 mb-6 border border-dark-500" 
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8
          }}>
          <StyledText className="text-xl font-bold text-gray-100 mb-3">Data Sources</StyledText>
          
          <StyledView className="bg-dark-600 rounded-xl p-4 mb-3">
            <StyledText className="text-base font-semibold text-primary-400 mb-1">HDB Resale Transactions</StyledText>
            <StyledText className="text-sm text-gray-300 mb-2">
              Official resale data from Singapore government (data.gov.sg)
            </StyledText>
            <StyledText className="text-xs text-gray-400">
              Updated monthly with 6 months of historical transactions
            </StyledText>
          </StyledView>
          
          <StyledView className="bg-dark-600 rounded-xl p-4">
            <StyledText className="text-base font-semibold text-primary-400 mb-1">Our Confidence Rating</StyledText>
            <StyledText className="text-sm text-gray-300 mb-1">
              Each valuation includes a confidence score based on:
            </StyledText>
            <StyledText className="text-xs text-gray-300 ml-3 mb-1">• Number of comparable properties</StyledText>
            <StyledText className="text-xs text-gray-300 ml-3 mb-1">• Data freshness and relevance</StyledText>
            <StyledText className="text-xs text-gray-300 ml-3">• Similarity of property characteristics</StyledText>
          </StyledView>
        </StyledView>
        
        <StyledView className="bg-dark-700 rounded-2xl p-5 mb-6 border border-dark-500" 
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8
          }}>
          <StyledText className="text-xl font-bold text-gray-100 mb-3">Disclaimer</StyledText>
          <StyledText className="text-base text-gray-300 leading-6">
            PropRadar provides insights based on historical transaction data, but market conditions change constantly. This app is for informational purposes only and should not replace professional advice. Always conduct thorough research and consult with licensed real estate professionals before making property decisions.
          </StyledText>
        </StyledView>
        
        <StyledView className="items-center mb-10">
          <StyledText className="text-gray-400 text-sm">
            Version 1.0.0
          </StyledText>
          <StyledText className="text-gray-500 text-xs mt-1">
            © 2023 PropRadar
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};