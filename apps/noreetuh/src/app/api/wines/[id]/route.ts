import { NextRequest, NextResponse } from 'next/server';
import { wineService } from '@/services/wine.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const wine = await wineService.getWineById(resolvedParams.id);
    
    if (!wine) {
      return NextResponse.json(
        { success: false, error: 'Wine not found' },
        { status: 404 }
      );
    }

    // Track view analytics
    const sessionId = request.headers.get('x-session-id') || undefined;
    await wineService.trackAnalytics(wine.id, 'VIEW', null, sessionId);

    return NextResponse.json({
      success: true,
      data: wine,
    });
  } catch (error) {
    console.error('Error fetching wine:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();
    const wine = await wineService.updateWine(resolvedParams.id, body);

    return NextResponse.json({
      success: true,
      data: wine,
    });
  } catch (error) {
    console.error('Error updating wine:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const success = await wineService.deleteWine(resolvedParams.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete wine' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting wine:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}