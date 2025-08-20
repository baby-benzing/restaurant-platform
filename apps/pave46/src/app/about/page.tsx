import { Metadata } from 'next';
import Image from 'next/image';
import { Container, Section } from '@restaurant-platform/web-common';

export const metadata: Metadata = {
  title: 'About | Pavé',
  description: 'Founded by Chef Jonghun Won, Pavé brings a European-style café and bakery experience to the heart of Midtown Manhattan.',
  openGraph: {
    title: 'About | Pavé',
    description: 'Learn about our story and philosophy.',
  },
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Story Section */}
      <Section spacing="xl" className="bg-white">
        <Container>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-900 mb-12">
              Our Story
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-lg text-neutral-700 leading-relaxed">
                  Founded by Chef Jonghun Won, Pavé brings a European-style café and 
                  bakery experience to the heart of Midtown Manhattan. Our journey 
                  began with a simple belief: there's nothing better than freshly baked 
                  bread, and nothing better than a sandwich built on that bread.
                </p>
                
                <p className="text-lg text-neutral-700 leading-relaxed">
                  Chef Won, originally from South Korea, trained in theology before 
                  discovering his passion for pastry. After serving as Executive Pastry 
                  Chef at Jungsik Seoul and helping establish the 2-Michelin starred 
                  Jungsik New York, he graduated from the Culinary Institute of America 
                  and now brings his expertise to Pavé.
                </p>
                
                <p className="text-lg text-neutral-700 leading-relaxed">
                  At Pavé, we're committed to maintaining traditional bread-making 
                  techniques while creating innovative sandwiches and pastries that 
                  delight our customers every day.
                </p>
              </div>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/images/restaurant/food-1.jpg"
                    alt="Freshly prepared food"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/images/restaurant/bar-1.jpg"
                    alt="Chef at work"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Philosophy Section */}
      <Section spacing="xl" className="bg-neutral-50">
        <Container>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-8">
                Our Philosophy
              </h2>
              
              <blockquote className="border-l-4 border-primary-600 pl-6 my-8">
                <p className="text-xl text-primary-600 italic font-serif leading-relaxed">
                  "We believe there's nothing better than freshly baked 
                  bread, and that there's nothing better than a sandwich 
                  built on that bread. Fresh is best!"
                </p>
              </blockquote>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">
                  Chef Jonghun Won
                </h3>
                <ul className="space-y-2 text-lg text-neutral-700">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary-600">•</span>
                    Graduate of Culinary Institute of America
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary-600">•</span>
                    Former Executive Pastry Chef at Jungsik Seoul
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary-600">•</span>
                    Helped establish 2-Michelin starred Jungsik New York
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary-600">•</span>
                    Owner of La Tabatiere bakery in Closter, NJ
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Large Feature Images */}
            <div className="space-y-4">
              <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/restaurant/food-2.jpg"
                  alt="Signature croissant sandwich"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/restaurant/interior-1.jpg"
                  alt="Restaurant interior with brick archway"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Visit CTA */}
      <Section spacing="lg" className="bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-6">
              Experience Pavé
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Visit us in Midtown Manhattan for freshly baked bread, 
              artisanal sandwiches, and exceptional pastries made with love and expertise.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/menu"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                View Our Menu
              </a>
              <a
                href="/contact"
                className="inline-block bg-neutral-200 text-neutral-900 px-8 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
              >
                Visit Us Today
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}