'use client';

import { MapPin, Phone, Mail } from 'lucide-react';
import { ContactDisplay } from '@restaurant-platform/web-common';

interface LocationSectionProps {
  contact?: Array<{
    type: string;
    label?: string | null;
    value: string;
  }>;
}

export default function LocationSection({ contact }: LocationSectionProps) {
  const address = contact?.find((c) => c.type === 'address');
  const phone = contact?.find((c) => c.type === 'phone');
  const email = contact?.find((c) => c.type === 'email');

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <MapPin className="w-8 h-8 text-blue-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Visit Us
          </h2>
          <p className="text-gray-600">Find us at our location</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Contact Information</h3>

            {address && (
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{address.value}</p>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <a href={`tel:${phone.value}`} className="text-blue-600 hover:underline">
                    {phone.value}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <a href={`mailto:${email.value}`} className="text-blue-600 hover:underline">
                    {email.value}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 rounded-2xl overflow-hidden h-[300px] md:h-auto">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Map Integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
