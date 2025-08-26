import { promises as fs } from 'fs';
import path from 'path';

export interface MediaArticle {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  coverImage?: string;
  publishDate: Date;
  source?: string;
  author?: string;
  link?: string;
  isPremium: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MEDIA_DATA_FILE = path.join(process.cwd(), 'data', 'media.json');

class MediaService {
  private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(MEDIA_DATA_FILE);
    } catch {
      const dir = path.dirname(MEDIA_DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await this.saveArticles(this.getDefaultArticles());
    }
  }

  private getDefaultArticles(): MediaArticle[] {
    return [
      {
        id: '1',
        restaurantId: 'pave46',
        title: 'The 21 Best Croissants in New York City Right Now',
        description: 'Featured in The New York Times comprehensive guide to NYC\'s best croissants, recognized for our authentic French lamination techniques and butter-rich pastries.',
        coverImage: '/images/media/nytimes-croissant.jpg',
        publishDate: new Date('2024-03-15'),
        source: 'The New York Times',
        author: 'Tejal Rao',
        link: 'https://www.nytimes.com/article/best-croissants-nyc.html',
        isPremium: false,
        isPublished: true,
        sortOrder: 0,
      },
      {
        id: '2',
        restaurantId: 'pave46',
        title: 'The Proustian Ideal of a Ham Sandwich',
        description: 'An exploration of the perfect ham sandwich, featuring our traditional jambon-beurre that channels the essence of Parisian café culture in Midtown Manhattan.',
        coverImage: '/images/media/nytimes-sandwich.jpg',
        publishDate: new Date('2022-11-25'),
        source: 'The New York Times',
        author: 'Pete Wells',
        link: 'https://www.nytimes.com/2022/11/25/dining/ham-sandwich-nyc.html',
        isPremium: false,
        isPublished: true,
        sortOrder: 1,
      },
      {
        id: '3',
        restaurantId: 'pave46',
        title: 'Front Burner: For the Love of Baguettes',
        description: 'Featured in a deep dive into NYC\'s baguette culture, highlighting our traditional French baking methods and commitment to authenticity.',
        coverImage: '/images/media/nytimes-baguette.jpg',
        publishDate: new Date('2022-09-26'),
        source: 'The New York Times',
        author: 'Florence Fabricant',
        link: 'https://www.nytimes.com/2022/09/26/dining/subway-sandwich-mta-alidoro.html',
        isPremium: false,
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: '4',
        restaurantId: 'pave46',
        title: 'Midtown Manhattan NYC Guide for Visitors and Jaded Locals',
        description: 'Selected by the Wall Street Journal as a must-visit destination in Midtown, praised for bringing authentic French bakery culture to the heart of Manhattan.',
        coverImage: '/images/media/wsj-guide.jpg',
        publishDate: new Date('2023-12-15'),
        source: 'Wall Street Journal',
        author: 'Sara Clemence',
        link: 'https://www.wsj.com/articles/midtown-manhattan-nyc-guide-for-visitors-locals-11671131623',
        isPremium: false,
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: '5',
        restaurantId: 'pave46',
        title: 'NYC Hidden Dining Gems',
        description: 'Discovered as one of NYC\'s hidden culinary treasures, celebrated for our intimate atmosphere and exceptional French pastries just steps from Times Square.',
        coverImage: '/images/media/daily-news.jpg',
        publishDate: new Date('2024-07-17'),
        source: 'NY Daily News',
        author: 'David Hinckley',
        link: 'https://www.nydailynews.com/2024/07/17/nyc-hidden-dining-gems-pave-french-bakery-times-square/',
        isPremium: false,
        isPublished: true,
        sortOrder: 4,
      },
      {
        id: '6',
        restaurantId: 'pave46',
        title: 'The Infatuation Review',
        description: 'Praised for our "perfect croissants" and "transportive atmosphere" that brings a slice of Paris to Midtown Manhattan.',
        coverImage: '/images/media/infatuation.jpg',
        publishDate: new Date('2024-02-01'),
        source: 'The Infatuation',
        author: 'Bryan Kim',
        link: 'https://www.theinfatuation.com/new-york/reviews/pave',
        isPremium: false,
        isPublished: true,
        sortOrder: 5,
      },
      {
        id: '7',
        restaurantId: 'pave46',
        title: 'Gladys Magazine Feature',
        description: 'Featured in this lifestyle publication celebrating the art of French baking and our commitment to traditional techniques in the modern NYC food scene.',
        coverImage: '/images/media/gladys.jpg',
        publishDate: new Date('2024-01-10'),
        source: 'Gladys Magazine',
        author: null,
        link: null,
        isPremium: true,
        isPublished: true,
        sortOrder: 6,
      },
    ];
  }

  async getArticles(filter?: { isPublished?: boolean }): Promise<MediaArticle[]> {
    await this.ensureDataFile();
    
    try {
      const data = await fs.readFile(MEDIA_DATA_FILE, 'utf-8');
      let articles: MediaArticle[] = JSON.parse(data);
      
      // Convert date strings back to Date objects
      articles = articles.map(article => ({
        ...article,
        publishDate: new Date(article.publishDate),
        createdAt: article.createdAt ? new Date(article.createdAt) : undefined,
        updatedAt: article.updatedAt ? new Date(article.updatedAt) : undefined,
      }));
      
      if (filter?.isPublished !== undefined) {
        articles = articles.filter(a => a.isPublished === filter.isPublished);
      }
      
      return articles.sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (error) {
      console.error('Error reading media data:', error);
      return this.getDefaultArticles();
    }
  }

  async getArticle(id: string): Promise<MediaArticle | null> {
    const articles = await this.getArticles();
    return articles.find(a => a.id === id) || null;
  }

  async createArticle(article: Omit<MediaArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaArticle> {
    const articles = await this.getArticles();
    
    const newArticle: MediaArticle = {
      ...article,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    articles.push(newArticle);
    await this.saveArticles(articles);
    
    return newArticle;
  }

  async updateArticle(id: string, updates: Partial<MediaArticle>): Promise<MediaArticle | null> {
    const articles = await this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    articles[index] = {
      ...articles[index],
      ...updates,
      id: articles[index].id,
      updatedAt: new Date(),
    };
    
    await this.saveArticles(articles);
    return articles[index];
  }

  async updateArticlesOrder(updatedArticles: MediaArticle[]): Promise<MediaArticle[]> {
    const articles = await this.getArticles();
    
    // Update the sortOrder for each article
    updatedArticles.forEach(updated => {
      const index = articles.findIndex(a => a.id === updated.id);
      if (index !== -1) {
        articles[index] = {
          ...articles[index],
          ...updated,
          updatedAt: new Date(),
        };
      }
    });
    
    await this.saveArticles(articles);
    return articles.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async deleteArticle(id: string): Promise<boolean> {
    const articles = await this.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    
    if (filtered.length === articles.length) return false;
    
    await this.saveArticles(filtered);
    return true;
  }

  private async saveArticles(articles: MediaArticle[]): Promise<void> {
    const dir = path.dirname(MEDIA_DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(MEDIA_DATA_FILE, JSON.stringify(articles, null, 2));
  }
}

export const mediaService = new MediaService();