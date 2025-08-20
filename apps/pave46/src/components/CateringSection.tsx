'use client';

import { useState } from 'react';
import { ChefHat, Users, Calendar, Package } from 'lucide-react';

export default function CateringSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventDate: '',
    eventTime: 'afternoon',
    eventType: '',
    guestCount: '',
    venue: '',
    address: '',
    deliveryType: 'delivery',
    message: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/catering/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          eventDate: '',
          eventTime: 'afternoon',
          eventType: '',
          guestCount: '',
          venue: '',
          address: '',
          deliveryType: 'delivery',
          message: '',
          budget: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-20" data-section="catering">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">
            Catering Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let us bring the authentic taste of Paris to your next event
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <ChefHat className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Corporate Events</h3>
            <p className="text-sm text-gray-600">
              Breakfast meetings, lunch presentations, and office parties
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <Users className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Private Parties</h3>
            <p className="text-sm text-gray-600">
              Birthday celebrations, anniversaries, and special occasions
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Social Events</h3>
            <p className="text-sm text-gray-600">
              Cocktail parties, receptions, and networking events
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <Package className="w-10 h-10 text-orange-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Custom Menus</h3>
            <p className="text-sm text-gray-600">
              Tailored menus to match your specific needs and preferences
            </p>
          </div>
        </div>

        {/* Catering Menu Info */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-light mb-4 text-gray-900">Our Catering Menu</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Breakfast & Brunch</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Fresh baked croissants and pastries</li>
                <li>• Artisanal breakfast sandwiches</li>
                <li>• French toast and quiche selections</li>
                <li>• Fresh fruit platters</li>
                <li>• Coffee and juice service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Lunch & Dinner</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Gourmet sandwich platters</li>
                <li>• Fresh salad trays</li>
                <li>• Charcuterie and cheese boards</li>
                <li>• Hot entrée options</li>
                <li>• Dessert selections</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            * Custom menus available. Minimum order requirements apply. 48-hour advance notice required.
          </p>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl font-light mb-8 text-center text-gray-900">
            Request Catering Quote
          </h3>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                Thank you for your inquiry! We'll contact you within 24 hours.
              </p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                Something went wrong. Please try again or call us at (646) 454-1387.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company (Optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Event Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="morning">Morning (7AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 10PM)</option>
                </select>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Event Type</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="social">Social Gathering</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  placeholder="Number of Guests *"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Location & Delivery</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Venue Name (Optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address *"
                required
                className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Budget Range (Optional)</option>
                <option value="under-500">Under $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="over-5000">Over $5,000</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your event, special dietary requirements, or specific menu preferences..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Catering Request'}
            </button>
          </form>
        </div>

        {/* Contact Alternative */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Prefer to speak with someone directly?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:6464541387"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (646) 454-1387
            </a>
            <a
              href="mailto:pavenyc@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}