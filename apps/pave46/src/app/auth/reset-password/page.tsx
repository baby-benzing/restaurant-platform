'use client';

import { useState } from 'react';
import { Container, Section, Card, Button } from '@restaurant-platform/web-common';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Section spacing="lg" className="pt-24 min-h-screen flex items-center">
        <Container>
          <div className="max-w-md mx-auto">
            <Card padding="lg" variant="shadow">
              <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-6 text-center">
                Reset Password
              </h1>

              {submitted ? (
                <div className="text-center">
                  <div className="text-green-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-neutral-700 mb-4">
                    If an account exists with that email, we've sent password reset instructions.
                  </p>
                  <p className="text-sm text-neutral-600">
                    Please check your email and follow the link to reset your password.
                  </p>
                  <div className="mt-6">
                    <a href="/auth/login" className="text-primary-600 hover:underline">
                      Back to login
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-neutral-700 mb-6 text-center">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email"
                      />
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <a
                      href="/auth/login"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Back to login
                    </a>
                  </div>
                </>
              )}
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}