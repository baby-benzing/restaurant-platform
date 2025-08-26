import { NextRequest, NextResponse } from 'next/server';
import { menuService } from '@/services/menu.service';

export async function GET(request: NextRequest) {
  try {
    // Note: Authentication is handled by middleware
    // If we reach here, the user is authenticated

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const isAvailable = searchParams.get('isAvailable');

    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (isAvailable !== null) {
      filter.isAvailable = isAvailable === 'true';
    }

    const items = await menuService.getMenuItems(filter);
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Note: Authentication is handled by middleware

    const body = await request.json();
    const newItem = await menuService.createMenuItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Note: Authentication is handled by middleware

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    const success = await menuService.deleteMenuItem(id);
    
    return NextResponse.json({
      success,
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Note: Authentication is handled by middleware

    const body = await request.json();
    const updatedItem = await menuService.updateMenuItem(body);
    
    return NextResponse.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}