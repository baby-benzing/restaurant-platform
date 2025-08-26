'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // In production, this would get the role from session
    // For now, we'll check if dev bypass is active
    const isDevMode = document.cookie.includes('dev-bypass-active=true');
    setUserRole('ADMIN'); // Mock - in production, get from session
  }, []);

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊', requiredRole: null },
    { href: '/admin/menu', label: 'Menu Management', icon: '🍽️', requiredRole: null },
    { href: '/admin/media', label: 'Press & Articles', icon: '📰', requiredRole: null },
    { href: '/admin/hours', label: 'Operating Hours', icon: '🕐', requiredRole: null },
    { href: '/admin/contact', label: 'Contact Info', icon: '📞', requiredRole: null },
    { href: '/admin/users', label: 'User Management', icon: '👥', requiredRole: 'ADMIN' },
    { href: '/admin/audit', label: 'Audit Logs', icon: '📋', requiredRole: 'ADMIN' },
  ].filter(item => !item.requiredRole || userRole === item.requiredRole);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
      <div className="p-6 border-b">
        <Link href="/admin/dashboard" className="block">
          <h2 className="text-2xl font-bold text-neutral-900">Pavé</h2>
          <p className="text-sm text-neutral-600">Admin Panel</p>
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}