import { NextRequest, NextResponse } from 'next/server';
import { wineService, WineFilter } from '@/services/wine.service';
import { getRestaurantData } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get restaurant
    const restaurant = await getRestaurantData();
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Build filter from query params
    const filter: WineFilter = {};
    
    const type = searchParams.get('type');
    if (type) {
      filter.type = type as any;
    }

    const minPrice = searchParams.get('minPrice');
    if (minPrice) {
      filter.minPrice = parseFloat(minPrice);
    }

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      filter.maxPrice = parseFloat(maxPrice);
    }

    const region = searchParams.get('region');
    if (region) {
      filter.region = region;
    }

    const country = searchParams.get('country');
    if (country) {
      filter.country = country;
    }

    const grapeVariety = searchParams.get('grapeVariety');
    if (grapeVariety) {
      filter.grapeVariety = grapeVariety;
    }

    const inventoryStatus = searchParams.get('inventoryStatus');
    if (inventoryStatus) {
      filter.inventoryStatus = inventoryStatus as any;
    }

    const featured = searchParams.get('featured');
    if (featured !== null) {
      filter.featured = featured === 'true';
    }

    const search = searchParams.get('search');
    if (search) {
      filter.search = search;
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = await wineService.getWines(restaurant.id, filter, page, limit);

    return NextResponse.json({
      success: true,
      data: result.wines,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('Error fetching wines:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const restaurant = await getRestaurantBySlug('noreetuh');
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const wine = await wineService.createWine(restaurant.id, body);

    return NextResponse.json({
      success: true,
      data: wine,
    });
  } catch (error) {
    console.error('Error creating wine:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}