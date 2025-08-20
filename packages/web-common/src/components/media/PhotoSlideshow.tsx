'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
}

export interface PhotoSlideshowProps extends React.HTMLAttributes<HTMLDivElement> {
  photos: Photo[];
  variant?: 'hero' | 'carousel' | 'grid' | 'masonry' | 'fade';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  showCaptions?: boolean;
  aspectRatio?: 'square' | '16:9' | '4:3' | '21:9' | 'auto';
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  onPhotoClick?: (photo: Photo, index: number) => void;
  enableLightbox?: boolean;
}

export const PhotoSlideshow = React.forwardRef<HTMLDivElement, PhotoSlideshowProps>(
  ({
    photos,
    variant = 'carousel',
    autoPlay = false,
    autoPlayInterval = 5000,
    showThumbnails = false,
    showIndicators = true,
    showArrows = true,
    showCaptions = false,
    aspectRatio = '16:9',
    columns = 3,
    gap = 'md',
    onPhotoClick,
    enableLightbox = true,
    className,
    ...props
  }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const goToNext = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const goToPrevious = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    const goToSlide = useCallback((index: number) => {
      setCurrentIndex(index);
    }, []);

    useEffect(() => {
      if (autoPlay && (variant === 'carousel' || variant === 'hero' || variant === 'fade')) {
        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
      }
    }, [autoPlay, autoPlayInterval, goToNext, variant]);

    const handlePhotoClick = (photo: Photo, index: number) => {
      if (enableLightbox && (variant === 'grid' || variant === 'masonry')) {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
      }
      onPhotoClick?.(photo, index);
    };

    const closeLightbox = () => {
      setIsLightboxOpen(false);
    };

    const aspectRatioClasses = {
      'square': 'aspect-square',
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '21:9': 'aspect-[21/9]',
      'auto': '',
    };

    const gapClasses = {
      'sm': 'gap-2',
      'md': 'gap-4',
      'lg': 'gap-6',
    };

    // Hero variant
    if (variant === 'hero') {
      const currentPhoto = photos[currentIndex];
      return (
        <div ref={ref} className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)} {...props}>
          <div className="absolute inset-0">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          
          {showCaptions && (currentPhoto.title || currentPhoto.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {currentPhoto.title && (
                <h2 className="text-3xl font-bold mb-2">{currentPhoto.title}</h2>
              )}
              {currentPhoto.description && (
                <p className="text-lg">{currentPhoto.description}</p>
              )}
            </div>
          )}

          {showArrows && photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}

          {showIndicators && photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  )}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Carousel variant
    if (variant === 'carousel') {
      return (
        <div ref={ref} className={cn('relative', className)} {...props}>
          <div className={cn('overflow-hidden rounded-lg', aspectRatioClasses[aspectRatio])}>
            <div
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {photos.map((photo, index) => (
                <div key={photo.id} className="w-full flex-shrink-0">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    onClick={() => handlePhotoClick(photo, index)}
                  />
                  {showCaptions && (photo.title || photo.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                      {photo.title && <h3 className="font-semibold">{photo.title}</h3>}
                      {photo.description && <p className="text-sm mt-1">{photo.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showArrows && photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}

          {showThumbnails && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-colors',
                    index === currentIndex ? 'border-primary-600' : 'border-transparent'
                  )}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Fade variant
    if (variant === 'fade') {
      return (
        <div ref={ref} className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)} {...props}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
                onClick={() => handlePhotoClick(photo, index)}
              />
              {showCaptions && (photo.title || photo.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  {photo.title && <h3 className="font-semibold">{photo.title}</h3>}
                  {photo.description && <p className="text-sm mt-1">{photo.description}</p>}
                </div>
              )}
            </div>
          ))}

          {showIndicators && photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  )}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Grid variant
    if (variant === 'grid') {
      return (
        <>
          <div
            ref={ref}
            className={cn(
              'grid',
              `grid-cols-2 md:grid-cols-${columns}`,
              gapClasses[gap],
              className
            )}
            {...props}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={cn('overflow-hidden rounded-lg cursor-pointer group', aspectRatioClasses[aspectRatio])}
                onClick={() => handlePhotoClick(photo, index)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {showCaptions && (photo.title || photo.description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.title && <h3 className="text-sm font-semibold">{photo.title}</h3>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {isLightboxOpen && enableLightbox && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
              <button
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                ×
              </button>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
                }}
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev + 1) % photos.length);
                }}
                aria-label="Next photo"
              >
                →
              </button>
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].alt}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              {photos[lightboxIndex].title && (
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-semibold">{photos[lightboxIndex].title}</h3>
                  {photos[lightboxIndex].description && (
                    <p className="mt-2">{photos[lightboxIndex].description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      );
    }

    // Masonry variant
    if (variant === 'masonry') {
      return (
        <div
          ref={ref}
          className={cn('columns-2 md:columns-' + columns, gapClasses[gap], className)}
          {...props}
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={cn('break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer group')}
              onClick={() => handlePhotoClick(photo, index)}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full transition-transform duration-300 group-hover:scale-105"
              />
              {showCaptions && (photo.title || photo.description) && (
                <div className="p-2 bg-white">
                  {photo.title && <h3 className="font-semibold">{photo.title}</h3>}
                  {photo.description && <p className="text-sm text-gray-600 mt-1">{photo.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }
);

PhotoSlideshow.displayName = 'PhotoSlideshow';

export default PhotoSlideshow;