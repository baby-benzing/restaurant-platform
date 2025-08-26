import { NextResponse } from 'next/server';
import { mediaService } from '@/services/media.service';

// GET - Fetch all media articles
export async function GET() {
  try {
    const articles = await mediaService.getArticles();
    return NextResponse.json({ articles });
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
    // Note: Authentication is handled by middleware
    const data = await request.json();
    
    const newArticle = await mediaService.createArticle({
      restaurantId: 'pave46',
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      publishDate: new Date(data.publishDate),
      source: data.source,
      author: data.author,
      link: data.link,
      isPremium: data.isPremium || false,
      isPublished: data.isPublished !== false,
      sortOrder: data.sortOrder ?? 999,
    });
    
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
    // Note: Authentication is handled by middleware
    const { articles } = await request.json();
    
    // Update articles with new order
    const updatedArticles = await mediaService.updateArticlesOrder(articles);
    
    return NextResponse.json({ articles: updatedArticles });
  } catch (error) {
    console.error('Error updating media articles:', error);
    return NextResponse.json(
      { error: 'Failed to update media articles' },
      { status: 500 }
    );
  }
}