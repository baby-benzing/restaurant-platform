'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SlideshowImage {
  src: string;
  alt: string;
}

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images: SlideshowImage[] = [
    { src: '/images/hulihuli-hero.jpg', alt: 'Hulihuli Hawaiian Restaurant' },
    { src: '/images/hulihuli-hero.jpg', alt: 'Authentic Hawaiian Cuisine' },
    { src: '/images/hulihuli-hero.jpg', alt: 'Island Flavors' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" data-section="home">
      {/* Image Container */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Logo/Brand with liquid glass backdrop */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative overflow-hidden">
          {/* Liquid glass backdrop */}
          <div className="absolute inset-0 -inset-x-4 inset-y-2 bg-white/10 backdrop-blur-md rounded-2xl" />
          {/* Brand */}
          <div className="relative px-8 py-4">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-wide">
              Hulihuli
            </h1>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white text-2xl md:text-4xl font-light tracking-wide drop-shadow-lg">
            Authentic Hawaiian Cuisine
          </p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-32 md:bottom-40 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

