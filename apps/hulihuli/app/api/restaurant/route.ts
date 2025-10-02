import { PrismaClient } from '@restaurant-platform/database';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
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

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant data' },
      { status: 500 }
    );
  }
}
