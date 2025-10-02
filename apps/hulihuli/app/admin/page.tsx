import Link from 'next/link';
import { Clock, MapPin, UtensilsCrossed } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/hours"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Hours</h2>
          </div>
          <p className="text-gray-600">Manage operating hours</p>
        </Link>

        <Link
          href="/admin/location"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Location</h2>
          </div>
          <p className="text-gray-600">Update contact information</p>
        </Link>

        <Link
          href="/admin/menu"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-green-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          </div>
          <p className="text-gray-600">Edit menu items</p>
        </Link>
      </div>
    </div>
  );
}
