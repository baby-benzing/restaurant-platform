import { Container } from '@restaurant-platform/web-common';
import type { RestaurantWithRelations } from '@/lib/api';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  restaurant: RestaurantWithRelations;
}

export default function Hero({ restaurant }: HeroProps) {

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Optimization */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="/images/restaurant/hero-main.jpg"
          alt="Pavé46 Restaurant"
          fill
          priority
          quality={90}
          objectFit="cover"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center text-white">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4">
            {restaurant.name}
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-white/90">
            European-Style Café & Bakery
          </p>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/80">
            Fresh breads, artisanal sandwiches, and French pastries in Midtown Manhattan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="bg-white text-neutral-900 px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              View Menu
            </a>
            <a
              href="https://pav-108819.square.site"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Order Online
            </a>
            <a
              href="#info"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Visit Us
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}