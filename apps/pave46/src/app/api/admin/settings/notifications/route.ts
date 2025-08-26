import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenLocal } from '@/lib/verify-token';
import { prisma } from '@restaurant-platform/database';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyTokenLocal(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get restaurant and settings
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: 'pave46' },
      include: { notificationSettings: true }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Return settings or default values
    const settings = restaurant.notificationSettings || {
      emailEnabled: true,
      emailAddresses: [],
      smsEnabled: false,
      phoneNumbers: [],
      notifyCatering: true,
      notifyContact: true,
      notifyOrders: false,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyTokenLocal(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: 'pave46' },
      include: { notificationSettings: true }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Update or create settings
    const settings = await prisma.notificationSettings.upsert({
      where: { restaurantId: restaurant.id },
      update: {
        emailEnabled: body.emailEnabled,
        emailAddresses: body.emailAddresses.filter((e: string) => e.trim() !== ''),
        smsEnabled: body.smsEnabled,
        phoneNumbers: body.phoneNumbers.filter((p: string) => p.trim() !== ''),
        notifyCatering: body.notifyCatering,
        notifyContact: body.notifyContact,
        notifyOrders: body.notifyOrders,
      },
      create: {
        restaurantId: restaurant.id,
        emailEnabled: body.emailEnabled,
        emailAddresses: body.emailAddresses.filter((e: string) => e.trim() !== ''),
        smsEnabled: body.smsEnabled,
        phoneNumbers: body.phoneNumbers.filter((p: string) => p.trim() !== ''),
        notifyCatering: body.notifyCatering,
        notifyContact: body.notifyContact,
        notifyOrders: body.notifyOrders,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}