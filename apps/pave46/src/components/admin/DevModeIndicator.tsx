'use client';

import { useEffect, useState } from 'react';

/**
 * Shows a warning banner when using development bypass login
 * Only visible when dev-bypass-active cookie is present
 */
export function DevModeIndicator() {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check for dev bypass cookie
    const hasDevBypass = document.cookie.includes('dev-bypass-active=true');
    setIsDevMode(hasDevBypass && process.env.NODE_ENV !== 'production');
  }, []);

  if (!isDevMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-lg">⚠️</span>
        <div>
          <div className="font-semibold text-sm">DEV MODE</div>
          <div className="text-xs">Using bypass login</div>
        </div>
      </div>
    </div>
  );
}