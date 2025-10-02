'use client';

import { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import HoursSection from './HoursSection';
import LocationSection from './LocationSection';

interface RestaurantData {
  hours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  contacts?: Array<{
    type: string;
    label?: string | null;
    value: string;
  }>;
}

export default function HomePage() {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/restaurant');
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Hours Section */}
      <HoursSection hours={restaurant?.hours} />

      {/* Location Section */}
      <LocationSection contact={restaurant?.contacts} />
    </div>
  );
}
