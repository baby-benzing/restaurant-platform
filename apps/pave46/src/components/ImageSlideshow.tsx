'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SlideshowImage {
  src: string;
  alt: string;
}

export default function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images: SlideshowImage[] = [
    { src: '/images/restaurant/hero-main.jpg', alt: 'Pavé Restaurant' },
    { src: '/images/restaurant/interior-1.jpg', alt: 'Restaurant Interior' },
    { src: '/images/restaurant/dining-1.jpg', alt: 'Dining Area' },
    { src: '/images/restaurant/bar-1.jpg', alt: 'Bar Area' },
    { src: '/images/restaurant/food-1.jpg', alt: 'Artisanal Food' },
    { src: '/images/restaurant/food-2.jpg', alt: 'Fresh Pastries' },
    { src: '/images/restaurant/food-3.jpg', alt: 'Signature Dishes' },
    { src: '/images/restaurant/ambiance-1.jpg', alt: 'Restaurant Ambiance' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

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
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
          </div>
        ))}
      </div>

      {/* Minimalist Logo/Title */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wider drop-shadow-lg">
          Pavé
        </h1>
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