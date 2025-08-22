import { NextResponse } from 'next/server';
import { mockMediaArticles } from '../admin/media/mockData';

// GET - Fetch published media articles for public display
export async function GET() {
  try {
    // Filter only published articles and sort by sortOrder
    const publishedArticles = mockMediaArticles
      .filter(article => article.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(article => ({
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