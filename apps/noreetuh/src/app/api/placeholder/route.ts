import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const width = parseInt(searchParams.get('w') || '600');
  const height = parseInt(searchParams.get('h') || '400');
  const text = searchParams.get('text') || 'Image';
  const bgColor = searchParams.get('bg') || 'e5e7eb';
  const textColor = searchParams.get('color') || 'ffffff';

  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(width, height) / 10}" 
        fill="#${textColor}"
      >
        ${text}
      </text>
      <text 
        x="50%" 
        y="60%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(width, height) / 20}" 
        fill="#${textColor}"
        opacity="0.7"
      >
        ${width}×${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}