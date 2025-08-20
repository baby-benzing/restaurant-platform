import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecentActivity, ActivityItem } from '../RecentActivity';

describe('RecentActivity', () => {
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'menu_update',
      description: 'Updated menu prices',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      user: 'admin@test.com',
    },
    {
      id: '2',
      type: 'hours_change',
      description: 'Changed opening hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'user_login',
      description: 'User logged in',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      user: 'editor@test.com',
    },
  ];

  it('renders the component title', () => {
    render(<RecentActivity activities={[]} />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows no activity message when activities array is empty', () => {
    render(<RecentActivity activities={[]} />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });

  it('renders all activity items', () => {
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText('Updated menu prices')).toBeInTheDocument();
    expect(screen.getByText('Changed opening hours')).toBeInTheDocument();
    expect(screen.getByText('User logged in')).toBeInTheDocument();
  });

  it('displays correct icons for activity types', () => {
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText('📝')).toBeInTheDocument(); // menu_update
    expect(screen.getByText('🕐')).toBeInTheDocument(); // hours_change
    expect(screen.getByText('👤')).toBeInTheDocument(); // user_login
  });

  it('shows relative timestamps correctly', () => {
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
  });

  it('displays user information when provided', () => {
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText('by admin@test.com')).toBeInTheDocument();
    expect(screen.getByText('by editor@test.com')).toBeInTheDocument();
  });

  it('handles "just now" timestamp correctly', () => {
    const justNowActivity: ActivityItem = {
      id: '4',
      type: 'settings_change',
      description: 'Settings updated',
      timestamp: new Date(),
    };

    render(<RecentActivity activities={[justNowActivity]} />);
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RecentActivity activities={[]} className="custom-activity-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-activity-class');
  });

  it('handles single minute correctly', () => {
    const oneMinuteAgo: ActivityItem = {
      id: '5',
      type: 'menu_update',
      description: 'Test activity',
      timestamp: new Date(Date.now() - 1000 * 60), // 1 minute ago
    };

    render(<RecentActivity activities={[oneMinuteAgo]} />);
    expect(screen.getByText('1 minute ago')).toBeInTheDocument();
  });

  it('handles single hour correctly', () => {
    const oneHourAgo: ActivityItem = {
      id: '6',
      type: 'menu_update',
      description: 'Test activity',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    };

    render(<RecentActivity activities={[oneHourAgo]} />);
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });

  it('handles single day correctly', () => {
    const oneDayAgo: ActivityItem = {
      id: '7',
      type: 'menu_update',
      description: 'Test activity',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    };

    render(<RecentActivity activities={[oneDayAgo]} />);
    expect(screen.getByText('1 day ago')).toBeInTheDocument();
  });
});