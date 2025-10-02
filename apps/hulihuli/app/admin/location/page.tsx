import { getRestaurantData } from '@/lib/restaurant';
import LocationEditor from '@/components/admin/LocationEditor';

export default async function AdminLocationPage() {
  const restaurant = await getRestaurantData();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Manage Location & Contact
      </h1>
      <LocationEditor
        restaurantId={restaurant?.id || ''}
        contacts={restaurant?.contacts || []}
      />
    </div>
  );
}
