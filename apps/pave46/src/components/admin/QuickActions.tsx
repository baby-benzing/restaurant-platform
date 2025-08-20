import React from 'react';
import Link from 'next/link';

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className = '' }: QuickActionsProps) {
  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href as any}
            className={`
              flex items-center space-x-3 p-3 rounded-md border border-neutral-200
              hover:bg-neutral-50 transition-colors
              ${action.color || ''}
            `}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-neutral-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}