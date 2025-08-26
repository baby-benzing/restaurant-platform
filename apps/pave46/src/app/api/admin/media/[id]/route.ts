import { NextResponse } from 'next/server';
import { mediaService } from '@/services/media.service';

// GET - Fetch a single media article
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await mediaService.getArticle(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
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

// PUT - Update a single media article
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Note: Authentication is handled by middleware
    const data = await request.json();
    
    const updatedArticle = await mediaService.updateArticle(params.id, {
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      publishDate: new Date(data.publishDate),
      source: data.source,
      author: data.author,
      link: data.link,
      isPremium: data.isPremium,
      isPublished: data.isPublished,
      sortOrder: data.sortOrder,
    });
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ article: updatedArticle });
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
    // Note: Authentication is handled by middleware
    const success = await mediaService.deleteArticle(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media article:', error);
    return NextResponse.json(
      { error: 'Failed to delete media article' },
      { status: 500 }
    );
  }
}