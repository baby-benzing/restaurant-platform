'use client';

import { useEffect } from 'react';
import { Container, Section, Button } from '@restaurant-platform/web-common';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="xl">
      <Container maxWidth="sm">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            We apologize for the inconvenience. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="primary">
              Try again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Go home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}