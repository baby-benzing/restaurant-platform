import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon,
  className = '' 
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
          {change && (
            <div className="mt-2 flex items-center">
              <span 
                className={`text-sm font-medium ${
                  change.type === 'increase' 
                    ? 'text-green-600' 
                    : change.type === 'decrease' 
                    ? 'text-red-600' 
                    : 'text-neutral-600'
                }`}
              >
                {change.type === 'increase' && '↑'}
                {change.type === 'decrease' && '↓'}
                {Math.abs(change.value)}%
              </span>
              <span className="ml-2 text-sm text-neutral-500">from last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-3xl text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}