'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@restaurant-platform/web-common';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  aspectRatio?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showSkeleton?: boolean;
}

export function OptimizedImage({
  src,
  fallbackSrc = '/images/placeholder.svg',
  alt,
  width,
  height,
  fill,
  aspectRatio,
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  objectFit = 'cover',
  showSkeleton = true,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  // Remove conflicting props from the spread
  const { 
    loading: _loading, 
    priority: _priority, 
    width: _width, 
    height: _height, 
    fill: _fill,
    ...cleanProps 
  } = props as any;
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleLoad = (e: any) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e: any) => {
    setIsLoading(false);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    onError?.(e);
  };

  const computedHeight = height || (width && aspectRatio ? Number(width) / aspectRatio : undefined);

  // Build image props based on whether fill is used
  const imageProps: any = {
    src: imageSrc,
    alt,
    sizes,
    quality,
    style: {
      objectFit,
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out',
    },
    onLoad: handleLoad,
    onError: handleError,
    ...cleanProps,
  };

  // Add either priority or loading, not both
  if (priority) {
    imageProps.priority = true;
  } else {
    imageProps.loading = loading;
  }

  // Only add width/height if fill is not true
  if (fill) {
    imageProps.fill = true;
  } else {
    imageProps.width = width || 1920;
    imageProps.height = computedHeight || height || 1080;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showSkeleton && isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{ 
            width: fill ? '100%' : (width ? `${width}px` : '100%'),
            height: fill ? '100%' : (computedHeight ? `${computedHeight}px` : '100%')
          }}
        />
      )}
      <Image {...imageProps} />
    </div>
  );
}