import { auth } from '@/auth';
import { prisma } from '@restaurant-platform/database';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { restaurantId, contacts } = await request.json();

    // Update each contact entry
    for (const contact of contacts) {
      if (contact.id) {
        // Update existing contact
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            value: contact.value,
          },
        });
      } else {
        // Create new contact
        await prisma.contact.create({
          data: {
            restaurantId,
            type: contact.type,
            value: contact.value,
            label: contact.label,
            sortOrder: 0,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json({ error: 'Failed to update contacts' }, { status: 500 });
  }
}
