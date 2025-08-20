import { NextRequest, NextResponse } from 'next/server';
import { wineService } from '@/services/wine.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('x-session-id') || undefined;
    
    const { eventType, metadata, wineId } = body;

    if (wineId) {
      await wineService.trackAnalytics(
        wineId,
        eventType,
        metadata,
        sessionId
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}