'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, Home } from 'lucide-react';

interface AdminNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="text-xl font-display font-bold text-gray-900"
            >
              Hulihuli Admin
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-gray-600">
                {user.name || user.email}
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
