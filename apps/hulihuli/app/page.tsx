import { getRestaurantData } from '@/lib/restaurant';
import HeroBanner from '@/components/HeroBanner';
import LocationSection from '@/components/LocationSection';
import HoursSection from '@/components/HoursSection';
import MenuPreview from '@/components/MenuPreview';

export default async function Home() {
  const restaurant = await getRestaurantData();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Hours Section */}
      <HoursSection hours={restaurant?.hours} />

      {/* Location Section */}
      <LocationSection contact={restaurant?.contacts} />

      {/* Menu Preview */}
      <MenuPreview menu={restaurant?.menus?.[0]} />
    </main>
  );
}
