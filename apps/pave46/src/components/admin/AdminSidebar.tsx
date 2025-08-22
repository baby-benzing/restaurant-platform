'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/menu', label: 'Menu Management', icon: '🍽️' },
    { href: '/admin/media', label: 'Press & Articles', icon: '📰' },
    { href: '/admin/hours', label: 'Operating Hours', icon: '🕐' },
    { href: '/admin/contact', label: 'Contact Info', icon: '📞' },
  ];

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