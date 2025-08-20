'use client';

import { Grid } from '@restaurant-platform/web-common';
import { OptimizedImage } from './OptimizedImage';
import { ImageGallery } from './ImageGallery';

export default function AboutSection() {
  const aboutImages = [
    {
      src: '/images/restaurant/interior-1.jpg',
      alt: 'Restaurant Interior',
    },
    {
      src: '/images/restaurant/food-1.jpg',
      alt: 'Fresh Baked Bread',
    },
    {
      src: '/images/restaurant/food-2.jpg',
      alt: 'Artisanal Sandwiches',
    },
    {
      src: '/images/restaurant/food-3.jpg',
      alt: 'French Pastries',
    },
  ];

  return (
    <div>
      <Grid cols={2} gap="lg" responsive>
        <div>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-neutral-600">
            <p>
              Founded by Chef Jonghun Won, Pavé brings a European-style café and bakery experience to the heart of Midtown Manhattan. Our journey began with a simple belief: there&apos;s nothing better than freshly baked bread, and nothing better than a sandwich built on that bread.
            </p>
            <p>
              Chef Won, originally from South Korea, trained in theology before discovering his passion for pastry. After serving as Executive Pastry Chef at Jungsik Seoul and helping establish the 2-Michelin starred Jungsik New York, he graduated from the Culinary Institute of America and now brings his expertise to Pavé.
            </p>
            <p>
              At Pavé, we&apos;re committed to maintaining traditional bread-making techniques while creating innovative sandwiches and pastries that delight our customers every day.
            </p>
          </div>
          
          <div className="mt-8">
            <ImageGallery
              images={aboutImages}
              columns={2}
              gap="sm"
              aspectRatio="square"
              enableLightbox={true}
              lazyLoadOffset={50}
            />
          </div>
        </div>
        <div>
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <OptimizedImage
              src="/images/restaurant/dining-1.jpg"
              alt="Pavé46 Dining Experience"
              fill
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg"
            />
          </div>
          
          <div className="bg-primary-50 p-8 rounded-lg">
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">
              Our Philosophy
            </h3>
            <blockquote className="text-lg italic text-primary-700 border-l-4 border-primary-600 pl-4">
              "We believe there&apos;s nothing better than freshly baked bread, and that there&apos;s nothing better than a sandwich built on that bread. Fresh is best!"
            </blockquote>
            <div className="mt-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Chef Jonghun Won</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Graduate of Culinary Institute of America</li>
                <li>• Former Executive Pastry Chef at Jungsik Seoul</li>
                <li>• Helped establish 2-Michelin starred Jungsik New York</li>
                <li>• Owner of La Tabatiere bakery in Closter, NJ</li>
              </ul>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
}