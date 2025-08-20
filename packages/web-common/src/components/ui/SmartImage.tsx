'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '../../utils/cn';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  fallbackSrc?: string;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  quality = 75,
  fallbackSrc = '/images/placeholder/default.jpg',
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.();
  };

  // Generate placeholder div
  const placeholder = (
    <div
      className={cn(
        'animate-pulse',
        className
      )}
      style={{
        backgroundColor: placeholderColor,
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
      }}
    />
  );

  if (hasError && imgSrc === fallbackSrc) {
    // If even fallback fails, show colored placeholder
    return placeholder;
  }

  return (
    <>
      {isLoading && placeholder}
      <Image
        src={imgSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        className={cn(
          className,
          isLoading && 'invisible absolute'
        )}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};

export default SmartImage;