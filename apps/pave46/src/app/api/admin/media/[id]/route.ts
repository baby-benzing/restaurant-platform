import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Import mock data from parent route (in production, this would be from database)
import { mockMediaArticles } from '../mockData';

// GET - Fetch a single media article
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = mockMediaArticles.find(a => a.id === params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Media article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching media article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media article' },
      { status: 500 }
    );
  }
}

// PUT - Update a media article
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const index = mockMediaArticles.findIndex(a => a.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Media article not found' },
        { status: 404 }
      );
    }
    
    mockMediaArticles[index] = {
      ...mockMediaArticles[index],
      ...data,
      publishDate: new Date(data.publishDate),
      updatedAt: new Date(),
    };
    
    return NextResponse.json({ article: mockMediaArticles[index] });
  } catch (error) {
    console.error('Error updating media article:', error);
    return NextResponse.json(
      { error: 'Failed to update media article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a media article
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const index = mockMediaArticles.findIndex(a => a.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Media article not found' },
        { status: 404 }
      );
    }
    
    mockMediaArticles.splice(index, 1);
    
    // Reorder remaining articles
    mockMediaArticles.forEach((article, i) => {
      article.sortOrder = i;
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media article:', error);
    return NextResponse.json(
      { error: 'Failed to delete media article' },
      { status: 500 }
    );
  }
}

// Export mock data for use in other routes
export { mockMediaArticles };