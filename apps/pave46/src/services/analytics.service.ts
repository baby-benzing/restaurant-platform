import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface PageView {
  id: string;
  path: string;
  timestamp: Date;
  visitorId: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
}

export interface AnalyticsData {
  pageViews: PageView[];
  uniqueVisitors: Set<string>;
  dailyStats: Map<string, { views: number; visitors: Set<string> }>;
}

const ANALYTICS_DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');

class AnalyticsService {
  private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(ANALYTICS_DATA_FILE);
    } catch {
      const dir = path.dirname(ANALYTICS_DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await this.saveAnalytics({
        pageViews: [],
        uniqueVisitorIds: [],
        dailyStats: {},
      });
    }
  }

  private generateVisitorId(ip: string, userAgent: string): string {
    // Generate a consistent visitor ID based on IP and User Agent
    const hash = crypto.createHash('sha256');
    hash.update(ip + userAgent);
    return hash.digest('hex').substring(0, 16);
  }

  async trackPageView(
    path: string,
    ip?: string,
    userAgent?: string,
    referrer?: string
  ): Promise<void> {
    await this.ensureDataFile();
    
    const visitorId = this.generateVisitorId(
      ip || 'unknown',
      userAgent || 'unknown'
    );
    
    const pageView: PageView = {
      id: crypto.randomUUID(),
      path,
      timestamp: new Date(),
      visitorId,
      referrer,
      userAgent,
      ip,
    };
    
    const data = await this.loadAnalytics();
    data.pageViews.push(pageView);
    
    // Update unique visitors
    if (!data.uniqueVisitorIds.includes(visitorId)) {
      data.uniqueVisitorIds.push(visitorId);
    }
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    if (!data.dailyStats[today]) {
      data.dailyStats[today] = {
        views: 0,
        uniqueVisitors: [],
      };
    }
    data.dailyStats[today].views++;
    if (!data.dailyStats[today].uniqueVisitors.includes(visitorId)) {
      data.dailyStats[today].uniqueVisitors.push(visitorId);
    }
    
    // Keep only last 30 days of detailed page views to prevent file from growing too large
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    data.pageViews = data.pageViews.filter(
      pv => new Date(pv.timestamp) > thirtyDaysAgo
    );
    
    await this.saveAnalytics(data);
  }

  async getAnalytics(days: number = 30): Promise<{
    totalPageViews: number;
    uniqueVisitors: number;
    todayPageViews: number;
    todayUniqueVisitors: number;
    recentPageViews: PageView[];
    topPages: { path: string; views: number }[];
    dailyStats: { date: string; views: number; visitors: number }[];
  }> {
    await this.ensureDataFile();
    const data = await this.loadAnalytics();
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Filter page views within the time range
    const recentPageViews = data.pageViews.filter(
      pv => new Date(pv.timestamp) > startDate
    );
    
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = data.dailyStats[today] || { views: 0, uniqueVisitors: [] };
    
    // Calculate top pages
    const pageViewCounts = new Map<string, number>();
    recentPageViews.forEach(pv => {
      pageViewCounts.set(pv.path, (pageViewCounts.get(pv.path) || 0) + 1);
    });
    const topPages = Array.from(pageViewCounts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Prepare daily stats for the chart
    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = data.dailyStats[dateStr] || { views: 0, uniqueVisitors: [] };
      dailyStats.unshift({
        date: dateStr,
        views: dayStats.views,
        visitors: dayStats.uniqueVisitors.length,
      });
    }
    
    // Calculate unique visitors in the time range
    const uniqueVisitorsInRange = new Set<string>();
    recentPageViews.forEach(pv => uniqueVisitorsInRange.add(pv.visitorId));
    
    return {
      totalPageViews: recentPageViews.length,
      uniqueVisitors: uniqueVisitorsInRange.size,
      todayPageViews: todayStats.views,
      todayUniqueVisitors: todayStats.uniqueVisitors.length,
      recentPageViews: recentPageViews.slice(-20).reverse(), // Last 20 page views
      topPages,
      dailyStats,
    };
  }

  async getPageViewsForPath(path: string, days: number = 30): Promise<number> {
    await this.ensureDataFile();
    const data = await this.loadAnalytics();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return data.pageViews.filter(
      pv => pv.path === path && new Date(pv.timestamp) > startDate
    ).length;
  }

  private async loadAnalytics(): Promise<any> {
    try {
      const data = await fs.readFile(ANALYTICS_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      if (parsed.pageViews) {
        parsed.pageViews = parsed.pageViews.map((pv: any) => ({
          ...pv,
          timestamp: new Date(pv.timestamp),
        }));
      }
      
      return {
        pageViews: parsed.pageViews || [],
        uniqueVisitorIds: parsed.uniqueVisitorIds || [],
        dailyStats: parsed.dailyStats || {},
      };
    } catch (error) {
      console.error('Error loading analytics:', error);
      return {
        pageViews: [],
        uniqueVisitorIds: [],
        dailyStats: {},
      };
    }
  }

  private async saveAnalytics(data: any): Promise<void> {
    const dir = path.dirname(ANALYTICS_DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(ANALYTICS_DATA_FILE, JSON.stringify(data, null, 2));
  }
}

export const analyticsService = new AnalyticsService();