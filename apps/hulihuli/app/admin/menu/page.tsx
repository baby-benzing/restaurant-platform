import { getRestaurantData } from '@/lib/restaurant';
import MenuEditor from '@/components/admin/MenuEditor';

export default async function AdminMenuPage() {
  const restaurant = await getRestaurantData();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Manage Menu
      </h1>
      <MenuEditor
        restaurantId={restaurant?.id || ''}
        menu={restaurant?.menus?.[0]}
      />
    </div>
  );
}
