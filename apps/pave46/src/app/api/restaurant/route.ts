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
      description: 'Laid-back bakery and sandwich shop for freshly made breads including baguettes, ciabatta, focaccia and croissants. With specialty coffee offered.',
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
              name: 'Viennoiseries',
              description: 'Fresh baked every morning',
              category: 'VIENNOISERIES',
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
              category: 'SANDWICHES',
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
            {
              id: '3',
              name: 'Focaccia',
              description: 'Artisanal flatbreads',
              category: 'FOCACCIA',
              items: [
                {
                  id: '5',
                  name: 'Rosemary Focaccia',
                  description: 'Olive oil, sea salt, fresh rosemary',
                  price: 8.00,
                  isAvailable: true,
                },
                {
                  id: '6',
                  name: 'Tomato & Basil Focaccia',
                  description: 'Cherry tomatoes, fresh basil, garlic',
                  price: 9.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '4',
              name: 'Breads',
              description: 'Daily fresh baked breads',
              category: 'BREADS',
              items: [
                {
                  id: '7',
                  name: 'Sourdough Loaf',
                  description: 'Traditional slow-fermented sourdough',
                  price: 7.00,
                  isAvailable: true,
                },
                {
                  id: '8',
                  name: 'Baguette',
                  description: 'Classic French baguette',
                  price: 4.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '5',
              name: 'Soups',
              description: 'Seasonal soups',
              category: 'SOUP',
              items: [
                {
                  id: '9',
                  name: 'French Onion Soup',
                  description: 'Caramelized onions, gruyère, croutons',
                  price: 12.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '6',
              name: 'Salads',
              description: 'Fresh salads',
              category: 'SALADS',
              items: [
                {
                  id: '10',
                  name: 'Niçoise Salad',
                  description: 'Mixed greens, tuna, eggs, olives, anchovies',
                  price: 16.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '7',
              name: 'Pastries',
              description: 'Sweet treats',
              category: 'PASTRIES',
              items: [
                {
                  id: '11',
                  name: 'Fruit Tart',
                  description: 'Seasonal fruits, pastry cream',
                  price: 6.50,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '8',
              name: 'Wine Selection',
              description: 'Curated wines',
              category: 'WINE',
              items: [
                {
                  id: '12',
                  name: 'Côtes du Rhône',
                  description: 'Medium-bodied red wine',
                  price: 45.00,
                  isAvailable: true,
                },
              ],
            },
            {
              id: '9',
              name: 'Afternoon Menu',
              description: 'Available after 2pm',
              category: 'AFTERNOON_MENU',
              items: [
                {
                  id: '13',
                  name: 'Coffee & Pastry',
                  description: 'Espresso with choice of pastry',
                  price: 8.00,
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
        { type: 'address', label: 'Address', value: '20 West 46th Street, New York, NY 10036' },
      ],
      images: [],
    });
  }
}