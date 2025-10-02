'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hulihuli-hero.jpg"
          alt="Hulihuli Restaurant"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-center">
          Hulihuli
        </h1>
        <p className="text-xl md:text-2xl font-light text-center max-w-2xl">
          Authentic Hawaiian Cuisine
        </p>
      </div>
    </section>
  );
}
