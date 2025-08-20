'use client';

import { Card } from '@restaurant-platform/web-common';

export default function OnlineOrdering() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6">
        Online Ordering & Catering
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card variant="shadow" padding="lg">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">
            Order Online
          </h3>
          <p className="text-neutral-600 mb-6">
            Skip the line and order ahead for pickup. Fresh breads, sandwiches, and pastries ready when you are.
          </p>
          <a
            href="https://pav-108819.square.site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Order Now
          </a>
        </Card>

        <Card variant="shadow" padding="lg">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">
            Gift Cards
          </h3>
          <p className="text-neutral-600 mb-6">
            Give the gift of freshly baked goods. Perfect for any occasion or as a thoughtful gesture.
          </p>
          <a
            href="https://pav-108819.square.site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buy Gift Card
          </a>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">
          Catering Services
        </h3>
        <p className="text-neutral-600 mb-4">
          Planning an event? Let us provide fresh sandwiches, pastries, and more for your gathering. 
          Contact us for custom catering options.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:6464541387"
            className="inline-flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call (646) 454-1387
          </a>
          <span className="text-neutral-400 hidden sm:inline">|</span>
          <a
            href="mailto:pavenyc@gmail.com"
            className="inline-flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}