'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@restaurant-platform/web-common';
import Link from 'next/link';
import { StatCard } from '@/components/admin/StatCard';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { QuickActions } from '@/components/admin/QuickActions';
import { DashboardService, DashboardData } from '@/services/dashboard.service';

interface DashboardClientProps {
  userEmail: string | null;
  userRole: string | null;
}

export default function EnhancedDashboard({ userEmail, userRole }: DashboardClientProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const service = new DashboardService();
        const data = await service.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    { id: '1', label: 'Add Menu Item', href: '/admin/menu/new', icon: '➕' },
    { id: '2', label: 'Update Hours', href: '/admin/hours', icon: '🕐' },
    { id: '3', label: 'View Analytics', href: '/admin/analytics', icon: '📊' },
    { id: '4', label: 'Manage Users', href: '/admin/users', icon: '👥' },
  ];

  const filteredQuickActions = quickActions.filter(action => {
    if (userRole === 'ADMIN') return true;
    if (userRole === 'EDITOR' && action.id !== '4') return true;
    if (userRole === 'VIEWER' && action.id === '3') return true;
    return false;
  });

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900">
                Admin Dashboard
              </h1>
              <p className="text-neutral-600 mt-2">
                Welcome back, {userEmail || 'User'}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                View Site
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-500">Loading dashboard...</div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && dashboardData && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Page Views"
                  value={dashboardData.metrics.totalPageViews.toLocaleString()}
                  change={{
                    value: dashboardData.metrics.totalPageViewsChange,
                    type: dashboardData.metrics.totalPageViewsChange > 0 ? 'increase' : 'decrease'
                  }}
                  icon="👀"
                />
                <StatCard
                  title="Unique Visitors"
                  value={dashboardData.metrics.uniqueVisitors.toLocaleString()}
                  change={{
                    value: dashboardData.metrics.uniqueVisitorsChange,
                    type: dashboardData.metrics.uniqueVisitorsChange > 0 ? 'increase' : 
                          dashboardData.metrics.uniqueVisitorsChange < 0 ? 'decrease' : 'neutral'
                  }}
                  icon="👥"
                />
                <StatCard
                  title="Menu Views"
                  value={dashboardData.metrics.menuViews.toLocaleString()}
                  change={{
                    value: dashboardData.metrics.menuViewsChange,
                    type: dashboardData.metrics.menuViewsChange > 0 ? 'increase' : 'decrease'
                  }}
                  icon="📖"
                />
                <StatCard
                  title="Active Users"
                  value={dashboardData.metrics.activeUsers}
                  change={{
                    value: dashboardData.metrics.activeUsersChange,
                    type: 'neutral'
                  }}
                  icon="✅"
                />
              </div>

              {/* Activity and Actions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentActivity activities={dashboardData.recentActivity} />
                </div>
                <div>
                  <QuickActions actions={filteredQuickActions} />
                </div>
              </div>

              {/* Role indicator */}
              {userRole && (
                <div className="mt-8 text-sm text-neutral-500">
                  Logged in as: {userRole}
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </main>
  );
}