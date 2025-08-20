import { Container, Section } from '@restaurant-platform/web-common';
import { ImageGallery } from '@/components/ImageGallery';

const galleryImages = [
  {
    src: '/images/restaurant/hero-main.jpg',
    alt: 'Pavé46 Restaurant Interior',
    caption: 'Our warm and inviting atmosphere',
  },
  {
    src: '/images/restaurant/dining-1.jpg',
    alt: 'Dining Area',
    caption: 'Elegant dining experience',
  },
  {
    src: '/images/restaurant/interior-1.jpg',
    alt: 'Restaurant Interior Design',
    caption: 'Modern French-inspired decor',
  },
  {
    src: '/images/restaurant/food-1.jpg',
    alt: 'Signature Dish',
    caption: 'Fresh artisanal breads',
  },
  {
    src: '/images/restaurant/food-2.jpg',
    alt: 'Gourmet Sandwich',
    caption: 'Hand-crafted sandwiches',
  },
  {
    src: '/images/restaurant/food-3.jpg',
    alt: 'Pastries Selection',
    caption: 'Daily fresh pastries',
  },
  {
    src: '/images/restaurant/bar-1.jpg',
    alt: 'Coffee Bar',
    caption: 'Premium coffee selection',
  },
  {
    src: '/images/restaurant/ambiance-1.jpg',
    alt: 'Evening Ambiance',
    caption: 'Perfect for any occasion',
  },
];

export default function GalleryPage() {
  return (
    <main>
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
              Gallery
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Experience the atmosphere, food, and ambiance of Pavé46
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