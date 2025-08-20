import { NextRequest, NextResponse } from 'next/server';
import { wineService } from '@/services/wine.service';
import { getRestaurantData } from '@/lib/api';

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

    const restaurant = await getRestaurantData();
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are supported' },
        { status: 400 }
      );
    }

    // Parse CSV
    const text = await file.text();
    const wines = parseCSV(text);

    // Import wines
    const result = await wineService.importWines(
      restaurant.id,
      wines,
      file.name
    );

    return NextResponse.json({
      success: true,
      imported: result.success,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error uploading wines:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function parseCSV(text: string): any[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const wines = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const wine: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      
      // Map CSV headers to wine properties
      switch (header) {
        case 'wine name':
        case 'name':
          wine.name = value;
          break;
        case 'winery':
        case 'producer':
          wine.producer = value;
          break;
        case 'vintage':
        case 'year':
          wine.vintage = value ? parseInt(value) : undefined;
          break;
        case 'region':
          wine.region = value;
          break;
        case 'country':
          wine.country = value;
          break;
        case 'grape varieties':
        case 'grapes':
        case 'varietals':
          wine.grapeVarieties = value ? value.split(';').map(v => v.trim()) : [];
          break;
        case 'type':
          wine.type = value;
          break;
        case 'price':
        case 'bottle price':
          wine.bottlePrice = value ? parseFloat(value.replace(/[^0-9.]/g, '')) : undefined;
          break;
        case 'glass price':
          wine.glassPrice = value ? parseFloat(value.replace(/[^0-9.]/g, '')) : undefined;
          break;
        case 'tasting notes':
        case 'notes':
          wine.tastingNotes = value;
          break;
        case 'food pairings':
        case 'pairings':
          wine.foodPairings = value ? value.split(';').map(v => v.trim()) : [];
          break;
        case 'inventory status':
        case 'status':
          wine.inventoryStatus = value;
          break;
      }
    });

    if (wine.name) {
      wines.push(wine);
    }
  }

  return wines;
}