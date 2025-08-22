'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'white';
}

// HSL(165, 28%, 50%) converts to #5CA393
// This is the brand color from the logo
export const PAVE_BRAND_COLOR = '#5CA393';

export default function Logo({ 
  className = '', 
  width = 120,
  height = 60,
  variant = 'default'
}: LogoProps) {
  // For slideshow/dark backgrounds, use white version for visibility
  const isWhite = variant === 'white';
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/pave-logo.png"
        alt="Pavé - Freshly Baked Bread, Coffee & Sandwich"
        width={width}
        height={height}
        className="object-contain"
        priority
        style={{
          filter: isWhite 
            ? 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.5))' 
            : 'none'
        }}
      />
    </div>
  );
}