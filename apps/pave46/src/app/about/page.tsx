import { Metadata } from 'next';
import { Container, Section, Grid, Card } from '@restaurant-platform/web-common';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Pavé46, an intimate neighborhood cocktail bar in Hudson Square blending Parisian charm with New York sophistication.',
  openGraph: {
    title: 'About | Pavé46',
    description: 'Learn about our story and philosophy.',
  },
};

export default function AboutPage() {
  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 text-center mb-8">
              Our Story
            </h1>
            
            <div className="prose prose-lg mx-auto">
              <p className="text-neutral-600 leading-relaxed">
                Nestled in the heart of Hudson Square, Pavé46 is more than just a cocktail bar—it's 
                a love letter to the timeless elegance of Parisian bistros and the vibrant energy 
                of New York City.
              </p>
              
              <p className="text-neutral-600 leading-relaxed">
                Since opening our doors, we've been dedicated to creating an intimate space where 
                neighbors become friends, where every cocktail tells a story, and where the art of 
                hospitality is celebrated nightly.
              </p>

              <p className="text-neutral-600 leading-relaxed">
                Our carefully curated menu features classic cocktails with a modern twist, an 
                exceptional wine selection focusing on small producers, and refined small plates 
                that perfectly complement your drinks.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" background="gray">
        <Container>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 text-center mb-12">
            Our Philosophy
          </h2>
          
          <Grid cols={3} gap="lg" responsive>
            <Card padding="lg">
              <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">
                Quality First
              </h3>
              <p className="text-neutral-600">
                We source only the finest ingredients, from our spirits to our garnishes, 
                ensuring every drink is crafted to perfection.
              </p>
            </Card>
            
            <Card padding="lg">
              <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">
                Timeless Hospitality
              </h3>
              <p className="text-neutral-600">
                Our team is dedicated to providing warm, attentive service that makes 
                every guest feel like a regular from their first visit.
              </p>
            </Card>
            
            <Card padding="lg">
              <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">
                Community Focus
              </h3>
              <p className="text-neutral-600">
                We're proud to be a neighborhood gathering place, fostering connections 
                and creating memories one evening at a time.
              </p>
            </Card>
          </Grid>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
              Visit Us
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Experience the charm of Pavé46 for yourself. We look forward to welcoming you.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}