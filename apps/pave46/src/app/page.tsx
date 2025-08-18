import { Suspense } from 'react';
import { 
  Container, 
  Section,
  Grid,
  Card,
  Loading 
} from '@restaurant-platform/web-common';
import { getRestaurantData } from '@/lib/api';
import Hero from '@/components/Hero';
import FeaturedMenu from '@/components/FeaturedMenu';
import RestaurantInfo from '@/components/RestaurantInfo';

export default async function HomePage() {
  const restaurant = await getRestaurantData();

  return (
    <main>
      <Hero restaurant={restaurant} />
      
      <Section spacing="lg" id="menu">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">
              Our Menu
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Carefully curated selections of cocktails, wines, and small plates
            </p>
          </div>
          <Suspense fallback={<Loading text="Loading menu..." />}>
            <FeaturedMenu menu={restaurant.menus[0]} />
          </Suspense>
        </Container>
      </Section>

      <Section spacing="lg" background="gray" id="info">
        <Container>
          <Grid cols={2} gap="lg" responsive>
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
                Visit Us
              </h2>
              <RestaurantInfo 
                hours={restaurant.hours}
                contacts={restaurant.contacts}
              />
            </div>
            <div>
              <Card variant="shadow" padding="lg">
                <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">
                  Make a Reservation
                </h3>
                <p className="text-neutral-600 mb-6">
                  Join us for an unforgettable evening of French cuisine and exceptional cocktails.
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:2125550146"
                    className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Call (212) 555-0146
                  </a>
                  <a
                    href="mailto:reservations@pave46.com"
                    className="block w-full text-center border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Email Reservations
                  </a>
                </div>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-4">
              Follow Us
            </h2>
            <p className="text-neutral-600 mb-6">
              Stay updated with our latest offerings and events
            </p>
            <a
              href="https://instagram.com/pave46nyc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
              @pave46nyc
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}