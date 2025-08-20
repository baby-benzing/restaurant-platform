import Link from 'next/link';
import { Container, Section, Button } from '@restaurant-platform/web-common';

export default function NotFound() {
  return (
    <Section spacing="xl">
      <Container maxWidth="sm">
        <div className="text-center">
          <h1 className="text-6xl font-serif font-bold text-primary-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="primary">
              Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}