'use client';

import { useState } from 'react';

/**
 * Development-only quick login panel
 * Provides instant access without Google SSO for testing
 */
export function DevLoginPanel() {
  const [loading, setLoading] = useState(false);

  // Only render in development
  // Note: In Next.js client components, we need to check this differently
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (!isDevelopment) {
    return null;
  }

  const handleDevLogin = async (role: 'admin' | 'editor' | 'viewer') => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Force a hard refresh to ensure cookies are set
        window.location.href = '/admin/dashboard';
      } else {
        alert('Dev login failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Dev login error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-lg font-semibold text-yellow-900">
          Development Mode - Quick Login
        </h3>
      </div>
      
      <p className="text-sm text-yellow-800 mb-4">
        Skip Google SSO for local development. This panel is only visible in development mode.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleDevLogin('admin')}
          disabled={loading}
          className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="font-semibold">Admin</div>
          <div className="text-xs opacity-90">Full access</div>
        </button>

        <button
          onClick={() => handleDevLogin('editor')}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="font-semibold">Editor</div>
          <div className="text-xs opacity-90">Content mgmt</div>
        </button>

        <button
          onClick={() => handleDevLogin('viewer')}
          disabled={loading}
          className="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="font-semibold">Viewer</div>
          <div className="text-xs opacity-90">Read only</div>
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center text-sm text-yellow-700">
          Logging in...
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-yellow-300">
        <p className="text-xs text-yellow-700">
          <strong>Dev Users:</strong><br />
          • admin@dev.local (Admin role)<br />
          • editor@dev.local (Editor role)<br />
          • viewer@dev.local (Viewer role)
        </p>
      </div>
    </div>
  );
}