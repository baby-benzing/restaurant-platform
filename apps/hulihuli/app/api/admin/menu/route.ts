import { auth } from '@/auth';
import { PrismaClient } from '@restaurant-platform/database';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { restaurantId, menuId, sections } = await request.json();

    // Update each section and its items
    for (const section of sections) {
      for (const item of section.items) {
        if (item.id.startsWith('new-')) {
          // Create new item
          await prisma.menuItem.create({
            data: {
              sectionId: section.id,
              name: item.name,
              description: item.description,
              price: item.price,
              sortOrder: item.sortOrder,
              isAvailable: item.isAvailable,
            },
          });
        } else {
          // Update existing item
          await prisma.menuItem.update({
            where: { id: item.id },
            data: {
              name: item.name,
              description: item.description,
              price: item.price,
              isAvailable: item.isAvailable,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}
