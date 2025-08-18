import { Metadata } from 'next';
import { 
  Container, 
  Section, 
  Grid, 
  Card,
  OperatingHours,
  ContactInfo 
} from '@restaurant-platform/web-common';
import { getRestaurantData } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Visit Pavé46 in Hudson Square. Find our hours, location, and contact information.',
  openGraph: {
    title: 'Contact | Pavé46',
    description: 'Visit us in Hudson Square. Find our hours and contact information.',
  },
};

export default async function ContactPage() {
  const restaurant = await getRestaurantData();

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 text-center mb-12">
            Visit Pavé46
          </h1>

          <Grid cols={2} gap="lg" responsive>
            <div>
              <Card padding="lg" variant="bordered">
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
                  Hours & Location
                </h2>
                
                <div className="space-y-6">
                  <OperatingHours 
                    hours={restaurant.hours}
                    showToday
                    groupSimilar
                  />
                  
                  <div className="pt-6 border-t border-neutral-200">
                    <ContactInfo 
                      contacts={restaurant.contacts}
                      showIcons
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card padding="lg" variant="shadow">
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
                  Reservations
                </h2>
                
                <p className="text-neutral-600 mb-6">
                  We recommend making reservations in advance, especially for weekend evenings. 
                  Walk-ins are always welcome based on availability.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">By Phone</h3>
                    <p className="text-neutral-600">
                      Call us at{' '}
                      <a href="tel:2125550146" className="text-primary-600 hover:underline">
                        (212) 555-0146
                      </a>{' '}
                      during business hours.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">By Email</h3>
                    <p className="text-neutral-600">
                      Send reservation requests to{' '}
                      <a href="mailto:reservations@pave46.com" className="text-primary-600 hover:underline">
                        reservations@pave46.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Private Events</h3>
                    <p className="text-neutral-600">
                      For private dining and events, please contact{' '}
                      <a href="mailto:events@pave46.com" className="text-primary-600 hover:underline">
                        events@pave46.com
                      </a>
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg" variant="bordered" className="mt-6">
                <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">
                  Getting Here
                </h3>
                
                <div className="space-y-3 text-neutral-600">
                  <div>
                    <strong>Subway:</strong> 1 train to Houston St, C/E to Spring St
                  </div>
                  <div>
                    <strong>Bus:</strong> M20, M21 to Hudson St
                  </div>
                  <div>
                    <strong>Parking:</strong> Street parking available, nearby garages on Hudson St
                  </div>
                </div>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section spacing="md" background="gray">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-neutral-600 mb-6">
              Follow us for updates on special events and new menu items
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://instagram.com/pave46nyc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Instagram
              </a>
              <span className="text-neutral-400">•</span>
              <a
                href="https://facebook.com/pave46nyc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Facebook
              </a>
              <span className="text-neutral-400">•</span>
              <a
                href="mailto:info@pave46.com"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}