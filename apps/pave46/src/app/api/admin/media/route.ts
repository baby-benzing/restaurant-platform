import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mockMediaArticles } from './mockData';

// GET - Fetch all media articles
export async function GET() {
  try {
    // Sort by sortOrder
    const sortedArticles = [...mockMediaArticles].sort((a, b) => a.sortOrder - b.sortOrder);
    
    return NextResponse.json({ articles: sortedArticles });
  } catch (error) {
    console.error('Error fetching media articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media articles' },
      { status: 500 }
    );
  }
}

// POST - Create a new media article
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const newArticle = {
      id: String(Date.now()),
      restaurantId: 'pave46',
      ...data,
      publishDate: new Date(data.publishDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockMediaArticles.push(newArticle);
    
    return NextResponse.json({ article: newArticle });
  } catch (error) {
    console.error('Error creating media article:', error);
    return NextResponse.json(
      { error: 'Failed to create media article' },
      { status: 500 }
    );
  }
}

// PUT - Update multiple articles (for reordering)
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articles } = await request.json();
    
    // Update sortOrder for each article
    articles.forEach((updated: any) => {
      const index = mockMediaArticles.findIndex(a => a.id === updated.id);
      if (index !== -1) {
        mockMediaArticles[index] = {
          ...mockMediaArticles[index],
          ...updated,
          publishDate: new Date(updated.publishDate),
        };
      }
    });
    
    const sortedArticles = [...mockMediaArticles].sort((a, b) => a.sortOrder - b.sortOrder);
    
    return NextResponse.json({ articles: sortedArticles });
  } catch (error) {
    console.error('Error updating media articles:', error);
    return NextResponse.json(
      { error: 'Failed to update media articles' },
      { status: 500 }
    );
  }
}