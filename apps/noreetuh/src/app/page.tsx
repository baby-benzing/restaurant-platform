import { Suspense } from 'react';
import Image from 'next/image';
import { 
  Container, 
  Section,
  Grid,
  Loading,
  ContactDisplay,
  HoursDisplay,
  OnlineOrder,
  MenuDisplay
} from '@restaurant-platform/web-common';
import { getRestaurantData } from '@/lib/api';
import WineListWrapper from './wine-list-wrapper';

// Use static imports for images to ensure they're bundled
const placeholderHero = '/api/placeholder?w=1920&h=1080&text=Noreetuh&bg=1f2937';
const placeholderFood = '/api/placeholder?w=800&h=600&text=Hawaiian+Cuisine&bg=fbbf24';
const placeholderInterior = '/api/placeholder?w=800&h=600&text=Interior&bg=60a5fa';
const placeholderCocktail = '/api/placeholder?w=600&h=800&text=Cocktails&bg=f472b6';

export default async function HomePage() {
  const restaurant = await getRestaurantData();

  // Transform data for shared components
  const contactData = {
    address: restaurant.contacts?.find((c: any) => c.type === 'ADDRESS') ? {
      street: '128 First Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10009',
    } : undefined,
    phone: restaurant.contacts?.find((c: any) => c.type === 'PHONE')?.value,
    email: restaurant.contacts?.find((c: any) => c.type === 'EMAIL')?.value,
    socialMedia: {
      instagram: restaurant.contacts?.find((c: any) => c.label === 'Instagram')?.value,
    },
    reservations: {
      provider: 'Resy',
      url: 'https://resy.com/cities/ny/noreetuh',
    },
  };

  const hoursData = restaurant.hours?.map((h: any) => ({
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek] || 'Unknown',
    openTime: h.openTime,
    closeTime: h.closeTime,
    isClosed: h.isClosed,
  })) || [];

  const orderProviders = [
    {
      name: 'Caviar',
      url: 'https://www.trycaviar.com/m/noreetuh-11421',
      type: 'both' as const,
    },
    {
      name: 'Grubhub',
      url: 'https://www.grubhub.com/restaurant/noreetuh',
      type: 'both' as const,
    },
  ];

  return (
    <main className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
        <Image 
          src={placeholderHero}
          alt="Noreetuh Restaurant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-wide">
              NOREETUH
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light tracking-widest uppercase">
              Modern Hawaiian Cuisine
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#menu"
                className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-wide text-sm"
              >
                View Menu
              </a>
              <a
                href="https://resy.com/cities/ny/noreetuh"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Reserve a Table
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <Section spacing="lg" className="bg-white">
        <Container>
          <Grid cols={2} gap="lg" responsive>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-neutral-900">
                Aloha & Welcome
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Noreetuh is a Hawaiian-inspired restaurant in the East Village serving 
                shareable dishes with a focus on local and sustainable ingredients.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our menu features traditional Hawaiian flavors with modern techniques, 
                complemented by tropical cocktails and a carefully curated wine list.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Join us for dinner and experience the spirit of aloha in the heart of New York City.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48">
                <Image 
                  src={placeholderInterior}
                  alt="Restaurant Interior"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="relative h-48">
                <Image 
                  src={placeholderFood}
                  alt="Tuna Poke"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="relative h-48">
                <Image 
                  src={placeholderCocktail}
                  alt="Tropical Cocktail"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="relative h-48">
                <Image 
                  src={placeholderFood}
                  alt="Signature Dish"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Menu Section */}
      <Section spacing="lg" className="bg-neutral-50" id="menu">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
              Menu
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Hawaiian-inspired dishes meant for sharing, featuring fresh seafood and local ingredients
            </p>
          </div>
          
          {restaurant.menus?.[0] && (
            <Suspense fallback={<Loading text="Loading menu..." />}>
              <MenuDisplay
                menu={{
                  id: restaurant.menus[0].id,
                  name: '',
                  description: '',
                  sections: restaurant.menus[0].sections || [],
                }}
                variant="detailed"
                showPrices
                showDescriptions
                columns={1}
              />
            </Suspense>
          )}
          
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 italic">
              Menu items and prices subject to change. Market price items vary daily.
            </p>
          </div>
        </Container>
      </Section>

      {/* Wine List Section - New */}
      <Section spacing="lg" className="bg-white" id="wine">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
              Wine List
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Carefully curated selection of wines to complement our Hawaiian cuisine
            </p>
          </div>
          <Suspense fallback={<Loading text="Loading wine list..." />}>
            <WineListWrapper />
          </Suspense>
        </Container>
      </Section>

      {/* Order & Reserve Section */}
      <Section spacing="lg" className="bg-neutral-50">
        <Container>
          <OnlineOrder
            providers={orderProviders}
            variant="default"
            title="Order Takeout & Delivery"
            description="Enjoy Noreetuh at home"
            reservationUrl="https://resy.com/cities/ny/noreetuh"
            reservationProvider="Resy"
          />
        </Container>
      </Section>

      {/* Contact & Hours Section */}
      <Section spacing="lg" className="bg-white">
        <Container>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-neutral-900">
            Visit Us
          </h2>
          <Grid cols={2} gap="lg" responsive>
            <div>
              <h3 className="text-2xl font-serif mb-6 text-neutral-900">Hours</h3>
              <HoursDisplay
                hours={hoursData}
                variant="default"
                showCurrentStatus
                highlightToday
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-serif mb-6 text-neutral-900">Location</h3>
              <ContactDisplay
                data={contactData}
                variant="default"
                showMap
                mapUrl="https://maps.google.com/?q=128+First+Avenue+New+York+NY+10009"
              />
            </div>
          </Grid>
        </Container>
      </Section>
    </main>
  );
}