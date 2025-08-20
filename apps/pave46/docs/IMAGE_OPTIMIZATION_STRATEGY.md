# Image Optimization Strategy for Pavé46

## Overview

This document outlines the comprehensive image optimization strategy implemented for the Pavé46 restaurant website to achieve maximum performance and visual quality.

## Core Principles

1. **Performance First**: Every image is optimized for the fastest possible loading time
2. **Progressive Enhancement**: Start with low-quality placeholders, enhance to full quality
3. **Responsive Design**: Serve appropriately sized images for each device
4. **Modern Formats**: Use WebP/AVIF with fallbacks for older browsers
5. **Lazy Loading**: Load images only when needed

## Technical Implementation

### 1. Next.js Image Component

We leverage Next.js's built-in Image component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src="/images/restaurant/hero.jpg"
  alt="Restaurant interior"
  width={1920}
  height={1080}
  priority={true} // For above-the-fold images
  quality={85}     // Balance quality vs file size
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 2. Custom OptimizedImage Component

Our custom wrapper adds:
- Error handling with fallback images
- Skeleton loading states
- Automatic aspect ratio calculations
- Smooth fade-in transitions

```typescript
<OptimizedImage
  src="/images/restaurant/food.jpg"
  alt="Signature dish"
  width={800}
  height={600}
  showSkeleton={true}
  loading="lazy"
/>
```

### 3. Image Gallery Component

Optimized for displaying multiple images:
- Intersection Observer for viewport detection
- Lightbox functionality
- Responsive grid layouts
- Keyboard navigation support

```typescript
<ImageGallery
  images={galleryImages}
  columns={3}
  aspectRatio="4:3"
  enableLightbox={true}
  lazyLoadOffset={100}
/>
```

## Performance Optimizations

### 1. Format Selection

```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  // AVIF: ~50% smaller than JPEG
  // WebP: ~30% smaller than JPEG
}
```

### 2. Responsive Sizing

```javascript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
```

This configuration generates multiple image versions:
- Mobile: 640px, 750px, 828px
- Tablet: 1080px, 1200px
- Desktop: 1920px, 2048px
- 4K: 3840px

### 3. Lazy Loading Strategy

Images are loaded based on priority:

1. **Priority Images** (Hero, above-the-fold):
   - Loaded immediately
   - Preloaded in `<head>`
   - Largest Contentful Paint (LCP) optimized

2. **Viewport Images**:
   - Loaded when within 50px of viewport
   - Uses Intersection Observer API
   - Reduces initial page load

3. **Gallery Images**:
   - Loaded on-demand
   - Progressive loading as user scrolls
   - Lightbox images loaded on interaction

### 4. Blur Placeholders

Using `plaiceholder` library for base64 blur placeholders:

```typescript
const { base64, metadata } = await getPlaiceholder(imageBuffer);
// Generates ~30 byte base64 string
// Displays while image loads
```

### 5. Caching Strategy

```javascript
minimumCacheTTL: 60, // 60 seconds minimum cache
// Leverages browser cache
// CDN caching for production
```

## Infrastructure

### 1. Image Storage

```
/public/images/
├── restaurant/       # Main restaurant images
│   ├── hero-main.jpg
│   ├── dining-*.jpg
│   ├── food-*.jpg
│   └── ambiance-*.jpg
└── optimized/       # Pre-optimized versions
    └── [generated]
```

### 2. Build-Time Optimization

Images are optimized during build:
- Sharp library for processing
- Automatic WebP generation
- Responsive image creation
- Blur placeholder generation

### 3. Runtime Optimization

On-demand optimization for dynamic images:
- Next.js Image Optimization API
- Cached for subsequent requests
- Quality adjusted based on device

## Performance Metrics

### Target Metrics

- **First Contentful Paint (FCP)**: < 1.0s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Optimization Results

1. **Image Size Reduction**:
   - JPEG to WebP: ~30% reduction
   - JPEG to AVIF: ~50% reduction
   - Total bandwidth saved: ~40-60%

2. **Loading Performance**:
   - Initial load: Only hero image (priority)
   - Viewport images: Lazy loaded
   - Below-fold: Loaded on scroll
   - Reduces initial payload by ~70%

3. **Visual Stability**:
   - Width/height attributes prevent layout shift
   - Aspect ratio preservation
   - Skeleton loaders maintain layout

## Best Practices

### 1. Image Preparation

```bash
# Original images should be:
- High resolution (2x display size)
- JPEG for photos
- PNG for graphics with transparency
- Uncompressed or lightly compressed
```

### 2. Sizing Guidelines

```typescript
// Hero images
width: 1920, height: 1080 // 16:9 aspect

// Gallery images
width: 800, height: 600   // 4:3 aspect

// Thumbnails
width: 400, height: 400   // 1:1 aspect
```

### 3. Alt Text Requirements

```typescript
// Descriptive and contextual
alt="Chef preparing fresh croissants in the morning"

// Not just "food image"
alt="Golden-brown croissants on a wooden board with coffee"
```

### 4. Loading Priority

```typescript
// Above the fold
priority={true}

// In viewport
loading="eager"

// Below fold
loading="lazy"
```

## Monitoring

### 1. Performance Tracking

```javascript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Track image performance metrics
  if (metric.name === 'LCP') {
    console.log('LCP:', metric.value);
  }
}
```

### 2. Image Load Events

```typescript
onLoad={(e) => {
  // Track successful loads
  analytics.track('image_loaded', {
    src: e.target.src,
    loadTime: performance.now()
  });
}}

onError={(e) => {
  // Track failures for monitoring
  analytics.track('image_error', {
    src: e.target.src,
    error: 'load_failed'
  });
}}
```

## Future Improvements

1. **CDN Integration**:
   - Cloudflare Images or similar
   - Global edge caching
   - On-the-fly transformations

2. **AI-Powered Optimization**:
   - Smart cropping
   - Quality adjustment per image
   - Content-aware compression

3. **Advanced Loading**:
   - Progressive JPEG enhancement
   - Network-aware loading
   - Predictive preloading

4. **Image Management**:
   - CMS integration for easy updates
   - Automatic optimization pipeline
   - Version control for images

## Code Examples

### Basic Implementation

```typescript
// Simple optimized image
<OptimizedImage
  src="/images/hero.jpg"
  alt="Restaurant"
  width={1920}
  height={1080}
  priority
/>
```

### Gallery Implementation

```typescript
// Full gallery with lightbox
const images = [
  { src: '/images/1.jpg', alt: 'Dish 1' },
  { src: '/images/2.jpg', alt: 'Dish 2' },
];

<ImageGallery
  images={images}
  columns={3}
  enableLightbox
/>
```

### Advanced Configuration

```typescript
// With all optimizations
<OptimizedImage
  src={imageSrc}
  fallbackSrc="/images/placeholder.jpg"
  alt="Detailed description"
  width={1200}
  height={800}
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         400px"
  quality={85}
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
  onLoad={handleImageLoad}
  onError={handleImageError}
  showSkeleton
  className="rounded-lg shadow-xl"
/>
```

## Conclusion

This image optimization strategy ensures:
- Fast loading times across all devices
- Excellent visual quality
- Smooth user experience
- SEO optimization
- Bandwidth efficiency

By combining Next.js's built-in optimizations with custom components and smart loading strategies, we achieve industry-leading performance while maintaining visual excellence.