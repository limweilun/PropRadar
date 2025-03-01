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
          DEFAULT: '#0EA5E9', // Modern blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        undervalued: '#10B981', // green
        fairvalue: '#F59E0B', // amber
        overvalued: '#EF4444', // red
        background: '#0F172A', // Deep navy
        surface: '#1E293B', // Slate dark
        card: '#1E293B', // Slate dark
        text: '#E2E8F0', // Light gray
        lightText: '#94A3B8', // Slate gray
        accent: {
          DEFAULT: '#38BDF8', // Light blue
          light: '#0EA5E9', // Blue
        },
        dark: {
          900: '#0F172A', // Deep navy (background)
          800: '#1E293B', // Slate dark (surface)
          700: '#334155', // Slate (card, borders)
          600: '#475569', // Slate (inputs)
          500: '#64748B', // Slate (elevated components)
          400: '#94A3B8', // Slate (higher elements, inactive icons)
          300: '#CBD5E1', // Slate (highest elements)
          200: '#E2E8F0', // Slate (text)
          100: '#F1F5F9', // Slate (high emphasis text)
          50: '#F8FAFC',  // Slate (bright text)
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

