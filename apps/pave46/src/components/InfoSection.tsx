'use client';

import { HoursDisplay, ContactDisplay } from '@restaurant-platform/web-common';

interface InfoSectionProps {
  restaurant: any;
}

export default function InfoSection({ restaurant }: InfoSectionProps) {
  return (
    <div className="min-h-screen bg-white px-4 py-20" data-section="info">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-gray-900">
          Information
        </h2>

        {/* About Us */}
        <div className="mb-16">
          <h3 className="text-2xl font-light mb-6 text-gray-900">About Pavé46</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Welcome to Pavé46, your neighborhood French bakery and café in the heart of Midtown Manhattan. 
              We bring the authentic taste of Paris to New York with our freshly baked breads, artisanal 
              sandwiches, and delicate pastries.
            </p>
            <p className="mt-4">
              Every morning, our skilled bakers start before dawn to prepare fresh croissants, baguettes, 
              and an array of French pastries using traditional techniques and the finest ingredients. 
              Whether you&apos;re looking for a quick breakfast, a leisurely lunch, or treats to take home, 
              Pavé46 offers a genuine taste of French culinary tradition.
            </p>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Hours</h3>
            {restaurant?.hours ? (
              <HoursDisplay hours={restaurant.hours} />
            ) : (
              <p className="text-gray-600">Loading hours...</p>
            )}
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                Note: We are closed on Saturdays
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Contact</h3>
            {restaurant?.contacts ? (
              <ContactDisplay contacts={restaurant.contacts} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:6464541387" className="text-blue-600 hover:underline">
                    (646) 454-1387
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:pavenyc@gmail.com" className="text-blue-600 hover:underline">
                    pavenyc@gmail.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Visit Us</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 font-medium mb-2">Pavé46</p>
              <p className="text-gray-600">
                511 10th Avenue<br />
                New York, NY 10018<br />
                Midtown Manhattan
              </p>
              <div className="mt-6">
                <a
                  href="https://maps.google.com/?q=511+10th+Avenue+New+York+NY+10018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-700">Quick Access</p>
                  <p className="text-sm text-gray-600">2 minute walk from 42nd St - Port Authority</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-700">Convenient Location</p>
                  <p className="text-sm text-gray-600">Near Hell&apos;s Kitchen & Times Square</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-light mb-6 text-gray-900">Follow Us</h3>
          <a
            href="https://instagram.com/pave_nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
            @pave_nyc
          </a>
        </div>
      </div>
    </div>
  );
}