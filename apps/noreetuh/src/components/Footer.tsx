import { Container } from '@restaurant-platform/web-common';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Location */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Location</h3>
            <p className="text-neutral-300">
              128 First Avenue<br />
              New York, NY 10009<br />
              East Village
            </p>
            <a
              href="https://maps.google.com/?q=128+First+Avenue+New+York+NY+10009"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              Get Directions →
            </a>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Dinner Hours</h3>
            <div className="space-y-1 text-neutral-300 text-sm">
              <div className="flex justify-between">
                <span>Mon - Wed</span>
                <span>5:30 PM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Thu - Sat</span>
                <span>5:30 PM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>5:30 PM - 10:00 PM</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              Kitchen closes 30 minutes before closing
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Contact</h3>
            <div className="space-y-2">
              <a
                href="tel:6468923050"
                className="block text-neutral-300 hover:text-white transition-colors"
              >
                (646) 892-3050
              </a>
              <a
                href="mailto:info@noreetuh.com"
                className="block text-neutral-300 hover:text-white transition-colors"
              >
                info@noreetuh.com
              </a>
              <div className="pt-2 space-y-2">
                <a
                  href="https://instagram.com/noreetuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                  @noreetuh
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://resy.com/cities/ny/noreetuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Make a Reservation
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Noreetuh. All rights reserved.</p>
          <p className="mt-2">Modern Hawaiian Cuisine in the East Village</p>
        </div>
      </Container>
    </footer>
  );
}