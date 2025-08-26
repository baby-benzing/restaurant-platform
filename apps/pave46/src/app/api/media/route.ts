import { NextResponse } from 'next/server';
import { mediaService } from '@/services/media.service';

// GET - Fetch published media articles for public display
export async function GET() {
  try {
    // Get only published articles
    const articles = await mediaService.getArticles({ isPublished: true });
    
    // Map to public format (exclude admin-only fields)
    const publishedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      coverImage: article.coverImage,
      publishDate: article.publishDate,
      source: article.source,
      author: article.author,
      link: article.link,
      isPremium: article.isPremium,
    }));
    
    return NextResponse.json({ articles: publishedArticles });
  } catch (error) {
    console.error('Error fetching media articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media articles' },
      { status: 500 }
    );
  }
}