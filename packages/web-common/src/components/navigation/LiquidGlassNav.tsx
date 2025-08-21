'use client';

import React from 'react';

export interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

export interface LiquidGlassNavProps {
  items: NavItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  className?: string;
  position?: 'bottom' | 'top';
  variant?: 'dark' | 'light';
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  items,
  activeId,
  onItemClick,
  className = '',
  position = 'bottom',
  variant = 'dark',
}) => {
  const positionClasses = position === 'bottom' 
    ? 'fixed bottom-0 left-0 right-0 pb-4 md:pb-8' 
    : 'fixed top-0 left-0 right-0 pt-4 md:pt-8';

  const variantClasses = {
    dark: {
      nav: 'bg-black/10 backdrop-blur-xl border-white/20',
      activeButton: 'bg-gradient-to-b from-white/30 to-white/10',
      inactiveButton: 'hover:bg-white/10',
      activeIcon: 'bg-gradient-to-br from-blue-500/80 to-blue-600/80 text-white',
      inactiveIcon: 'bg-gradient-to-br from-gray-600/60 to-gray-700/60 text-gray-200',
      activeLabel: 'text-white',
      inactiveLabel: 'text-gray-300',
    },
    light: {
      nav: 'bg-white/70 backdrop-blur-xl border-gray-200/50',
      activeButton: 'bg-gradient-to-b from-gray-900/20 to-gray-900/10',
      inactiveButton: 'hover:bg-gray-900/5',
      activeIcon: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white',
      inactiveIcon: 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700',
      activeLabel: 'text-gray-900',
      inactiveLabel: 'text-gray-600',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`${positionClasses} z-50 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <nav 
          className={`flex justify-around items-center ${styles.nav} rounded-[28px] p-1.5 border shadow-xl`}
          role="navigation"
          aria-label="Main navigation"
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                relative flex flex-col items-center justify-center
                w-16 h-16 md:w-20 md:h-20 rounded-[20px] transition-all duration-300
                ${activeId === item.id 
                  ? `${styles.activeButton} shadow-lg scale-105` 
                  : styles.inactiveButton
                }
              `}
              aria-label={item.label}
              aria-current={activeId === item.id ? 'page' : undefined}
              data-testid={`nav-item-${item.id}`}
            >
              <div 
                className={`
                  p-2 md:p-3 rounded-[16px] transition-all duration-300
                  ${activeId === item.id 
                    ? `${styles.activeIcon} shadow-inner` 
                    : styles.inactiveIcon
                  }
                  backdrop-blur-md
                `}
                data-testid={`nav-icon-${item.id}`}
              >
                {item.icon}
              </div>
              <span 
                className={`
                  text-[10px] mt-1 font-medium transition-colors duration-300
                  ${activeId === item.id ? styles.activeLabel : styles.inactiveLabel}
                `}
                data-testid={`nav-label-${item.id}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};