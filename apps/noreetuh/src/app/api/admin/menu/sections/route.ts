import { NextResponse } from 'next/server';
import { menuService } from '@/services/menu.service';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sections = await menuService.getMenuSections();
    
    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error('Error fetching menu sections:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}