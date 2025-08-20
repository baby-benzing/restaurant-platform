import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@restaurant-platform/database';
import { sendNotificationEmail, sendNotificationSMS } from '@/services/notification-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: 'pave46' },
      include: { notificationSettings: true }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Create catering inquiry
    const inquiry = await prisma.cateringInquiry.create({
      data: {
        restaurantId: restaurant.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company || null,
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime,
        eventType: body.eventType || null,
        guestCount: parseInt(body.guestCount),
        venue: body.venue || null,
        address: body.address,
        deliveryType: body.deliveryType,
        message: body.message,
        budget: body.budget || null,
      }
    });

    // Send notifications if enabled
    if (restaurant.notificationSettings?.notifyCatering) {
      const notificationData = {
        type: 'New Catering Inquiry',
        name: body.name,
        email: body.email,
        phone: body.phone,
        eventDate: body.eventDate,
        guestCount: body.guestCount,
        message: body.message
      };

      // Send email notifications
      if (restaurant.notificationSettings.emailEnabled && restaurant.notificationSettings.emailAddresses.length > 0) {
        for (const email of restaurant.notificationSettings.emailAddresses) {
          await sendNotificationEmail(email, 'New Catering Inquiry', notificationData);
        }
      }

      // Send SMS notifications
      if (restaurant.notificationSettings.smsEnabled && restaurant.notificationSettings.phoneNumbers.length > 0) {
        for (const phone of restaurant.notificationSettings.phoneNumbers) {
          await sendNotificationSMS(phone, `New catering inquiry from ${body.name} for ${body.guestCount} guests on ${body.eventDate}`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Catering inquiry submitted successfully',
      inquiryId: inquiry.id 
    });

  } catch (error) {
    console.error('Error submitting catering inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit catering inquiry' },
      { status: 500 }
    );
  }
}