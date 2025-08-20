import { prisma, type Restaurant } from '@restaurant-platform/database';

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
  id: '2',
  slug: 'noreetuh',
  name: 'Noreetuh',
  description: 'Modern Hawaiian cuisine in the East Village',
  logo: '/images/noreetuh-logo.png',
  createdAt: new Date(),
  updatedAt: new Date(),
  menus: [
    {
      id: '1',
      name: 'Main Menu',
      description: 'Hawaiian-inspired shareable dishes',
      isActive: true,
      sections: [
        {
          id: '1',
          name: 'Small Plates',
          description: 'To share',
          items: [
            {
              id: '1',
              name: 'Tuna Poke',
              description: 'Sesame oil, scallion, macadamia nut',
              price: 18,
              isAvailable: true,
            },
            {
              id: '2',
              name: 'Hamachi Crudo',
              description: 'Citrus, chili, cilantro',
              price: 19,
              isAvailable: true,
            },
          ],
        },
        {
          id: '2',
          name: 'Large Plates',
          description: 'Heartier dishes',
          items: [
            {
              id: '3',
              name: 'Kalua Pig',
              description: 'Slow roasted pork, cabbage slaw',
              price: 28,
              isAvailable: true,
            },
            {
              id: '4',
              name: 'Grilled Octopus',
              description: 'Kimchi, peanuts, herbs',
              price: 26,
              isAvailable: true,
            },
          ],
        },
      ],
    },
  ],
  hours: [
    { dayOfWeek: 0, openTime: '17:30', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 1, openTime: '17:30', closeTime: '22:00', isClosed: true },
    { dayOfWeek: 2, openTime: '17:30', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 3, openTime: '17:30', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 4, openTime: '17:30', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 5, openTime: '17:30', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 6, openTime: '17:30', closeTime: '23:00', isClosed: false },
  ],
  contacts: [
    { type: 'PHONE', label: 'Reservations', value: '(646) 892-3050' },
    { type: 'EMAIL', label: 'General', value: 'info@noreetuh.com' },
    { type: 'ADDRESS', label: 'Location', value: '128 First Avenue, New York, NY 10009' },
  ],
  images: [
    { url: '/images/hero.jpg', alt: 'Noreetuh interior', category: 'hero' },
  ],
};

export async function getRestaurantData(): Promise<RestaurantWithRelations> {
  const slug = process.env.RESTAURANT_SLUG || 'noreetuh';
  
  try {
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