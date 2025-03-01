/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        undervalued: '#10B981', // green
        fairvalue: '#FBBF24', // yellow
        overvalued: '#EF4444', // red
        background: '#121212',
        surface: '#1E1E1E',
        card: '#242424',
        text: '#E5E7EB',
        lightText: '#9CA3AF',
        accent: {
          DEFAULT: '#06B6D4',
          light: '#0E7490',
        },
        dark: {
          900: '#121212', // Background
          800: '#1E1E1E', // Surface
          700: '#242424', // Card
          600: '#2C2C2C', // Input
          500: '#323232', // Elevated components
          400: '#383838', // Higher elevated components
          300: '#424242', // Highest elements
          200: '#6E6E6E', // Disabled state
          100: '#757575', // Low emphasis text
          50: '#8F8F8F',  // Medium emphasis text
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      // Remove boxShadow as it's not supported in React Native
      // Instead use shadowColor, shadowOffset, shadowOpacity, shadowRadius in React Native styles
      borderRadius: {
        card: '0.75rem',
      }
    },
  },
  plugins: [],
}

