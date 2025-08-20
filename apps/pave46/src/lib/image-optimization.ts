import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';

export interface OptimizedImage {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  aspectRatio: number;
}

export async function getOptimizedImage(imagePath: string): Promise<OptimizedImage> {
  try {
    const file = await fs.readFile(path.join(process.cwd(), 'public', imagePath));
    const { base64, metadata } = await getPlaiceholder(file);
    
    return {
      src: imagePath,
      width: metadata.width,
      height: metadata.height,
      blurDataURL: base64,
      aspectRatio: metadata.width / metadata.height,
    };
  } catch (error) {
    console.error(`Error optimizing image ${imagePath}:`, error);
    return {
      src: imagePath,
      width: 1920,
      height: 1080,
      blurDataURL: '',
      aspectRatio: 16 / 9,
    };
  }
}

export async function getMultipleOptimizedImages(
  imagePaths: string[]
): Promise<Record<string, OptimizedImage>> {
  const results: Record<string, OptimizedImage> = {};
  
  await Promise.all(
    imagePaths.map(async (path) => {
      results[path] = await getOptimizedImage(path);
    })
  );
  
  return results;
}

export const imageLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
};

export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  hero: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1080 },
};

export const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
export const imageSizesConfig = [16, 32, 48, 64, 96, 128, 256, 384];