import React from 'react';

export interface ActivityItem {
  id: string;
  type: 'menu_update' | 'hours_change' | 'user_login' | 'settings_change';
  description: string;
  timestamp: Date;
  user?: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}

export function RecentActivity({ activities, className = '' }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'menu_update':
        return '📝';
      case 'hours_change':
        return '🕐';
      case 'user_login':
        return '👤';
      case 'settings_change':
        return '⚙️';
      default:
        return '📋';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-neutral-500 text-sm">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900">{activity.description}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-neutral-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  {activity.user && (
                    <>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500">by {activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}