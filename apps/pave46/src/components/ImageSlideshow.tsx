'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from './Logo';

interface SlideshowImage {
  src: string;
  alt: string;
}

export default function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images: SlideshowImage[] = [
    { src: '/images/restaurant/baguette_brush.jpeg', alt: 'Artisan Bread Making' },
    { src: '/images/restaurant/sandwich_spread.jpeg', alt: 'Gourmet Sandwiches' },
    { src: '/images/restaurant/coffee_croisant.jpeg', alt: 'Coffee and Croissant' },
    { src: '/images/restaurant/croque_monsieur.jpeg', alt: 'Croque Monsieur' },
    { src: '/images/restaurant/sweets_spread.jpeg', alt: 'Fresh Pastries' },
    { src: '/images/restaurant/salmon_sandwich.jpeg', alt: 'Salmon Sandwich' },
    { src: '/images/restaurant/cauliflower_two_hands.jpeg', alt: 'Fresh Ingredients' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Increased to 3 seconds for better viewing

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" data-section="home">
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
            {/* Subtle overlay for better text/UI visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Logo - White version for visibility on photos */}
      <div className="absolute top-8 left-8 z-10">
        <Logo width={220} height={110} variant="white" />
      </div>


      {/* Dots Indicator */}
      <div className="absolute bottom-40 md:bottom-48 left-1/2 transform -translate-x-1/2 z-10">
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
    </div>
  );
}