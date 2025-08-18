import Image from 'next/image';
import { Container } from '@restaurant-platform/web-common';
import type { RestaurantWithRelations } from '@/lib/api';

interface HeroProps {
  restaurant: RestaurantWithRelations;
}

export default function Hero({ restaurant }: HeroProps) {
  const heroImage = restaurant.images.find(img => img.category === 'hero');

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full hero-gradient" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
          {restaurant.name}
        </h1>
        {restaurant.description && (
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white/90">
            {restaurant.description}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <a
            href="#menu"
            className="bg-white text-primary-900 px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
          >
            View Menu
          </a>
          <a
            href="#info"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Make a Reservation
          </a>
        </div>
      </Container>
    </section>
  );
}