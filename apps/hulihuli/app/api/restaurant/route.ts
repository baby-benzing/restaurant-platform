import { prisma } from '@restaurant-platform/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst({
    where: { slug: 'hulihuli' },
    include: {
      hours: { orderBy: { dayOfWeek: 'asc' } },
      contacts: { orderBy: { sortOrder: 'asc' } },
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
    },
  });

  return NextResponse.json(restaurant || {});
}
