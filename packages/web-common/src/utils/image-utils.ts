import { getPlaiceholder } from 'plaiceholder';

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty' | 'color';
}

// Generate a color-based placeholder for missing images
export const generateColorPlaceholder = (color: string = '#f3f4f6'): string => {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';
  
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 10, 10);
  
  return canvas.toDataURL();
};

// Default placeholder images for different categories
export const DEFAULT_IMAGES: Record<string, ImageAsset> = {
  hero: {
    src: '/images/placeholder/hero.jpg',
    alt: 'Restaurant hero image',
    placeholder: 'blur',
  },
  food: {
    src: '/images/placeholder/food.jpg',
    alt: 'Food dish',
    placeholder: 'blur',
  },
  interior: {
    src: '/images/placeholder/interior.jpg',
    alt: 'Restaurant interior',
    placeholder: 'blur',
  },
  cocktail: {
    src: '/images/placeholder/cocktail.jpg',
    alt: 'Cocktail',
    placeholder: 'blur',
  },
  logo: {
    src: '/images/placeholder/logo.png',
    alt: 'Restaurant logo',
    placeholder: 'empty',
  },
};

// Generate placeholder data for images
export async function getImageWithPlaceholder(src: string): Promise<ImageAsset> {
  try {
    const { base64, img } = await getPlaiceholder(src);
    return {
      src,
      alt: '',
      width: img.width,
      height: img.height,
      blurDataURL: base64,
      placeholder: 'blur',
    };
  } catch (error) {
    console.warn(`Failed to generate placeholder for ${src}:`, error);
    return {
      src,
      alt: '',
      placeholder: 'empty',
    };
  }
}

// Image path resolver with fallback
export function resolveImagePath(
  path: string,
  restaurant: string,
  category: 'hero' | 'food' | 'interior' | 'cocktail' | 'logo' = 'food'
): string {
  // Check if it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Try restaurant-specific path first
  const restaurantPath = `/images/${restaurant}/${path}`;
  
  // In production, we'd check if file exists
  // For now, return restaurant path with fallback option
  return restaurantPath;
}

// Get image with fallback
export function getImageWithFallback(
  src: string | undefined | null,
  category: keyof typeof DEFAULT_IMAGES = 'food'
): ImageAsset {
  if (!src) {
    return DEFAULT_IMAGES[category];
  }
  
  return {
    src,
    alt: DEFAULT_IMAGES[category].alt,
    placeholder: 'blur',
  };
}