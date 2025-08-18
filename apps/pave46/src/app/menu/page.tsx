import { Metadata } from 'next';
import { Container, Section, MenuDisplay } from '@restaurant-platform/web-common';
import { getRestaurantData } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore our curated selection of cocktails, wines, and small plates at Pavé46.',
  openGraph: {
    title: 'Menu | Pavé46',
    description: 'Explore our curated selection of cocktails, wines, and small plates.',
  },
};

export default async function MenuPage() {
  const restaurant = await getRestaurantData();
  const menu = restaurant.menus[0];

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
              Our Menu
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {menu?.description || 'Carefully curated selections for every palate'}
            </p>
          </div>

          {menu ? (
            <MenuDisplay menu={menu} columns={1} />
          ) : (
            <p className="text-center text-neutral-500 py-12">
              Menu coming soon
            </p>
          )}
        </Container>
      </Section>
    </main>
  );
}