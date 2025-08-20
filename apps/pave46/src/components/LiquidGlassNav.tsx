'use client';

import { Home, BookOpen, ShoppingBag, Info } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface LiquidGlassNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function LiquidGlassNav({ activeSection, onSectionChange }: LiquidGlassNavProps) {
  const navItems: NavItem[] = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'menu', icon: <BookOpen size={24} />, label: 'Menu' },
    { id: 'order', icon: <ShoppingBag size={24} />, label: 'Order' },
    { id: 'info', icon: <Info size={24} />, label: 'Info' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-8">
      <div className="max-w-sm mx-auto">
        <nav className="flex justify-around items-center bg-black/10 backdrop-blur-xl rounded-[28px] p-2 border border-white/20 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative flex flex-col items-center justify-center
                w-20 h-20 rounded-[22px] transition-all duration-300
                ${activeSection === item.id 
                  ? 'bg-gradient-to-b from-white/30 to-white/10 shadow-lg scale-105' 
                  : 'hover:bg-white/10'
                }
              `}
              aria-label={item.label}
            >
              <div className={`
                p-3 rounded-[18px] transition-all duration-300
                ${activeSection === item.id 
                  ? 'bg-gradient-to-br from-blue-500/80 to-blue-600/80 text-white shadow-inner' 
                  : 'bg-gradient-to-br from-gray-600/60 to-gray-700/60 text-gray-200'
                }
                backdrop-blur-md
              `}>
                {item.icon}
              </div>
              <span className={`
                text-[10px] mt-1 font-medium transition-colors duration-300
                ${activeSection === item.id ? 'text-white' : 'text-gray-300'}
              `}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}