'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hulihuli-hero.jpg"
        alt="Hulihuli"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white">Hulihuli</h1>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-3xl md:text-4xl font-light">Authentic Hawaiian Cuisine</p>
      </div>
    </section>
  );
}

