/**
 * Pavé Brand Theme Configuration
 * 
 * Logo color information:
 * - HSL: 165, 28%, 50%
 * - HEX: #5CA393
 * - RGB: 92, 163, 147
 */

export const theme = {
  colors: {
    brand: {
      primary: '#5CA393',      // HSL(165, 28%, 50%) - Main brand color from logo
      primaryHSL: 'hsl(165, 28%, 50%)',
      primaryRGB: 'rgb(92, 163, 147)',
      
      // Variations
      light: '#7AB5A7',        // HSL(165, 28%, 60%)
      lighter: '#98C7BB',      // HSL(165, 28%, 70%)
      dark: '#4A8577',         // HSL(165, 28%, 40%)
      darker: '#3A6A5F',       // HSL(165, 28%, 30%)
    },
    
    // Existing color scheme
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
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
    }
  },
  
  logo: {
    default: {
      width: 140,
      height: 70,
    },
    hero: {
      width: 160,
      height: 80,
    },
    mobile: {
      width: 100,
      height: 50,
    }
  }
};

export default theme;