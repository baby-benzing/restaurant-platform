import type { Restaurant } from '@restaurant-platform/database';

// This function should only be called from server-side code
// For client-side, use the /api/restaurant endpoint
export interface RestaurantWithRelations extends Restaurant {
  menus: Array<{
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    sections: Array<{
      id: string;
      name: string;
      description: string | null;
      items: Array<{
        id: string;
        name: string;
        description: string | null;
        price: number | null;
        isAvailable: boolean;
      }>;
    }>;
  }>;
  hours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  contacts: Array<{
    type: string;
    label: string | null;
    value: string;
  }>;
  images: Array<{
    url: string;
    alt: string | null;
    category: string | null;
  }>;
}

// Mock data for development (when database is not available)
const mockRestaurantData: RestaurantWithRelations = {
  id: '1',
  slug: 'pave46',
  name: 'Pavé',
  description: 'An intimate neighborhood cocktail bar in Hudson Square',
  logo: '/images/pave-logo.png',
  createdAt: new Date(),
  updatedAt: new Date(),
  menus: [
    {
      id: '1',
      name: 'Main Menu',
      description: 'Our curated selection',
      isActive: true,
      sections: [
        {
          id: '1',
          name: 'Signature Cocktails',
          description: 'Crafted with care and creativity',
          items: [
            {
              id: '1',
              name: 'Le Boulevardier',
              description: 'Rye whiskey, Campari, sweet vermouth',
              price: 16,
              isAvailable: true,
            },
            {
              id: '2',
              name: 'French 75',
              description: 'Gin, lemon juice, simple syrup, champagne',
              price: 15,
              isAvailable: true,
            },
          ],
        },
        {
          id: '2',
          name: 'Small Plates',
          description: 'Perfect accompaniments',
          items: [
            {
              id: '3',
              name: 'Cheese Board',
              description: 'Selection of three artisanal cheeses',
              price: 24,
              isAvailable: true,
            },
            {
              id: '4',
              name: 'Oysters',
              description: 'Half dozen, mignonette, lemon',
              price: 18,
              isAvailable: true,
            },
          ],
        },
      ],
    },
  ],
  hours: [
    { dayOfWeek: 0, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 1, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 2, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 3, openTime: '17:00', closeTime: '00:00', isClosed: false },
    { dayOfWeek: 4, openTime: '17:00', closeTime: '00:00', isClosed: false },
    { dayOfWeek: 5, openTime: '17:00', closeTime: '01:00', isClosed: false },
    { dayOfWeek: 6, openTime: '17:00', closeTime: '01:00', isClosed: false },
  ],
  contacts: [
    { type: 'phone', label: 'Reservations', value: '(212) 555-0146' },
    { type: 'email', label: 'General', value: 'info@pave46.com' },
    { type: 'address', label: 'Location', value: '181 Hudson Street, New York, NY' },
  ],
  images: [
    { url: '/images/hero.jpg', alt: 'Pavé interior', category: 'hero' },
  ],
};

export async function getRestaurantData(): Promise<RestaurantWithRelations> {
  const slug = process.env.RESTAURANT_SLUG || 'pave46';
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    console.warn('getRestaurantData should not be called from client-side code');
    return mockRestaurantData;
  }
  
  try {
    // Only import and use Prisma on the server side
    const { prisma } = await import('@restaurant-platform/database');
    
    // Try to fetch from database
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        menus: {
          where: { isActive: true },
          include: {
            sections: {
              orderBy: { sortOrder: 'asc' },
              include: {
                items: {
                  where: { isAvailable: true },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
        hours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        contacts: {
          orderBy: { sortOrder: 'asc' },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!restaurant) {
      console.warn('Restaurant not found in database, using mock data');
      return mockRestaurantData;
    }

    return restaurant as RestaurantWithRelations;
  } catch (error) {
    console.error('Failed to fetch restaurant data:', error);
    // Return mock data if database is not available
    return mockRestaurantData;
  }
}