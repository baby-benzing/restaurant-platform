import { useEffect, useState } from 'react';

export function useRestaurantData() {
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    fetch('/api/restaurant')
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(err => console.error(err));
  }, []);

  return { restaurant };
}
