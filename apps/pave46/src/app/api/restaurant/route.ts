import { NextResponse } from 'next/server';
import { getRestaurantData } from '@/lib/api';

export async function GET() {
  try {
    const restaurant = await getRestaurantData();
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    // Return mock data if database is not available
    return NextResponse.json({
      id: '1',
      slug: 'pave46',
      name: 'Pavé',
      description: 'Fresh French bakery and café in Midtown Manhattan',
      logo: '/images/pave-hero.svg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      menus: [
        {
          id: '1',
          name: 'Main Menu',
          description: 'Fresh daily selections',
          isActive: true,
          sections: [
            {
              id: '1',
              name: 'Breakfast & Pastries',
              description: 'Fresh baked every morning',
              items: [
                {
                  id: '1',
                  name: 'Croissant',
                  description: 'Buttery, flaky French croissant',
                  price: 4.50,
                  isAvailable: true,
                },
                {
                  id: '2',
                  name: 'Pain au Chocolat',
                  description: 'Chocolate-filled pastry',
                  price: 5.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '2',
              name: 'Sandwiches',
              description: 'Made to order',
              items: [
                {
                  id: '3',
                  name: 'Croque Monsieur',
                  description: 'Ham and cheese sandwich with béchamel',
                  price: 14.00,
                  isAvailable: true,
                },
                {
                  id: '4',
                  name: 'Baguette Jambon',
                  description: 'Fresh baguette with ham and butter',
                  price: 12.00,
                  isAvailable: true,
                },
              ],
            },
          ],
        },
      ],
      hours: [
        { dayOfWeek: 0, openTime: '09:00', closeTime: '15:00', isClosed: false },
        { dayOfWeek: 1, openTime: '07:00', closeTime: '16:00', isClosed: false },
        { dayOfWeek: 2, openTime: '07:00', closeTime: '19:00', isClosed: false },
        { dayOfWeek: 3, openTime: '07:00', closeTime: '19:00', isClosed: false },
        { dayOfWeek: 4, openTime: '07:00', closeTime: '19:00', isClosed: false },
        { dayOfWeek: 5, openTime: '07:00', closeTime: '16:00', isClosed: false },
        { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },
      ],
      contacts: [
        { type: 'phone', label: 'Phone', value: '(646) 454-1387' },
        { type: 'email', label: 'Email', value: 'pavenyc@gmail.com' },
        { type: 'address', label: 'Address', value: '511 10th Avenue, New York, NY 10018' },
      ],
      images: [],
    });
  }
}