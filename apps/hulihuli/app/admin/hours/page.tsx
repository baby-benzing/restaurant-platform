import { getRestaurantData } from '@/lib/restaurant';
import HoursEditor from '@/components/admin/HoursEditor';

export default async function AdminHoursPage() {
  const restaurant = await getRestaurantData();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Manage Hours
      </h1>
      <HoursEditor restaurantId={restaurant?.id || ''} hours={restaurant?.hours || []} />
    </div>
  );
}
