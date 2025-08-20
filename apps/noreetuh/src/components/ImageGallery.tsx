'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@restaurant-platform/web-common';
import { OptimizedImage } from './OptimizedImage';

interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  enableLightbox?: boolean;
  lazyLoadOffset?: number;
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 'md',
  aspectRatio = 'auto',
  enableLightbox = true,
  lazyLoadOffset = 50,
  className,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    auto: '',
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleImages((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        rootMargin: `${lazyLoadOffset}px`,
        threshold: 0.01,
      }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      imageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lazyLoadOffset]);

  const handleImageClick = useCallback((index: number) => {
    if (enableLightbox) {
      setSelectedImage(index);
    }
  }, [enableLightbox]);

  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) => 
      prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => 
      prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null
    );
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseLightbox();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleCloseLightbox, handlePrevious, handleNext]);

  return (
    <>
      <div
        className={cn(
          'grid',
          columnClasses[columns],
          gapClasses[gap],
          className
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            data-index={index}
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-[1.02]',
              aspectRatioClasses[aspectRatio],
              enableLightbox && 'cursor-pointer'
            )}
            onClick={() => handleImageClick(index)}
          >
            {visibleImages.has(index) ? (
              <>
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="w-full h-full object-cover"
                  sizes={`(max-width: 640px) 100vw, (max-width: 1024px) ${100 / columns}vw, ${100 / columns}vw`}
                  priority={index < 3}
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {enableLightbox && selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={handleCloseLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={handleCloseLightbox}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative max-w-7xl max-h-[90vh] mx-auto px-4" onClick={(e) => e.stopPropagation()}>
            {images[selectedImage] && (
              <>
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  width={images[selectedImage].width || 1920}
                  height={images[selectedImage].height || 1080}
                  className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                  priority
                />
                {images[selectedImage].caption && (
                  <p className="text-white text-center mt-4">{images[selectedImage].caption}</p>
                )}
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}