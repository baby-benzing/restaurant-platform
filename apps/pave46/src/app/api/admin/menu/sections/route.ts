import { NextRequest, NextResponse } from 'next/server';
import { menuService } from '@/services/menu.service';

export async function GET(request: NextRequest) {
  try {
    // Note: Authentication is handled by middleware

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