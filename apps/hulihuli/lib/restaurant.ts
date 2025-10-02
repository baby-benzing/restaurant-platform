import { PrismaClient } from '@restaurant-platform/database';

const prisma = new PrismaClient();

export async function getRestaurantData() {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        slug: 'hulihuli',
      },
      include: {
        hours: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
        contacts: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        menus: {
          where: {
            isActive: true,
          },
          include: {
            sections: {
              where: {},
              orderBy: {
                sortOrder: 'asc',
              },
              include: {
                items: {
                  where: {
                    isAvailable: true,
                  },
                  orderBy: {
                    sortOrder: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return null;
  }
}
