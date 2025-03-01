import { MarkerCategory, Property } from '../types';

// Format currency (SGD)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format price per square foot
export const formatPsf = (psf: number): string => {
  return `${formatCurrency(psf)}/sqft`;
};

// Format property size
export const formatSize = (size: number): string => {
  return `${size} sqft`;
};

// Format property type and room type
export const formatPropertyType = (property: Property): string => {
  if (property.type === 'HDB') {
    return `HDB ${property.roomType}`;
  }
  return `${property.type} ${property.roomType}`;
};

// Get undervaluation text
export const getUndervaluationText = (score: number): string => {
  if (score > 0) {
    return `${score}% below market`;
  }
  if (score < 0) {
    return `${Math.abs(score)}% above market`;
  }
  return 'Fair market value';
};

// Get marker category based on undervaluation score
export const getMarkerCategory = (score: number): MarkerCategory => {
  if (score >= 10) {
    return MarkerCategory.UNDERVALUED;
  }
  if (score <= -10) {
    return MarkerCategory.OVERVALUED;
  }
  return MarkerCategory.FAIRVALUE;
};

// Get color based on marker category
export const getMarkerColor = (category: MarkerCategory): string => {
  switch (category) {
    case MarkerCategory.UNDERVALUED:
      return '#10B981'; // green
    case MarkerCategory.FAIRVALUE:
      return '#FBBF24'; // yellow
    case MarkerCategory.OVERVALUED:
      return '#EF4444'; // red
    default:
      return '#FBBF24';
  }
};

// Format date for alerts
export const formatDate = (date: Date | string): string => {
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};