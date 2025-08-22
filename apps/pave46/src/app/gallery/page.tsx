import { Container, Section } from '@restaurant-platform/web-common';
import { ImageGallery } from '@/components/ImageGallery';

const galleryImages = [
  {
    src: '/images/restaurant/founders.jpeg',
    alt: 'Chef Jonghun Won and Team',
    caption: 'Our founding team bringing European bakery traditions to Manhattan',
  },
  {
    src: '/images/restaurant/barguette_chef_won.jpeg',
    alt: 'Chef Won with Fresh Baguettes',
    caption: 'Chef Jonghun Won with freshly baked artisanal baguettes',
  },
  {
    src: '/images/restaurant/baguette_brush.jpeg',
    alt: 'Artisan Bread Making',
    caption: 'Traditional bread-making techniques, brushing baguettes for the perfect crust',
  },
  {
    src: '/images/restaurant/croque_monsieur.jpeg',
    alt: 'Croque Monsieur',
    caption: 'Our signature Croque Monsieur - a French classic',
  },
  {
    src: '/images/restaurant/salmon_sandwich.jpeg',
    alt: 'Salmon Sandwich',
    caption: 'Fresh salmon sandwich with house-made accompaniments',
  },
  {
    src: '/images/restaurant/sandwich_spread.jpeg',
    alt: 'Sandwich Selection',
    caption: 'Daily selection of gourmet sandwiches',
  },
  {
    src: '/images/restaurant/coffee_croisant.jpeg',
    alt: 'Coffee and Croissant',
    caption: 'Perfect pairing - artisanal coffee and fresh croissants',
  },
  {
    src: '/images/restaurant/sweets_spread.jpeg',
    alt: 'Pastry Selection',
    caption: 'Delectable pastries and sweets made fresh daily',
  },
  {
    src: '/images/restaurant/cauliflower_two_hands.jpeg',
    alt: 'Fresh Ingredients',
    caption: 'Working with the finest, freshest ingredients',
  },
];

export default function GalleryPage() {
  return (
    <main className="pt-20">
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
              Gallery
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Experience the atmosphere, craftsmanship, and culinary artistry of Pavé
            </p>
          </div>
          <ImageGallery
            images={galleryImages}
            columns={3}
            gap="md"
            aspectRatio="4:3"
            enableLightbox={true}
            lazyLoadOffset={100}
          />
        </Container>
      </Section>
    </main>
  );
}