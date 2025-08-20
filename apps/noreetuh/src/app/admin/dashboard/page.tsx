import { headers } from 'next/headers';
import { Suspense } from 'react';
import EnhancedDashboard from './enhanced-page';

export default async function AdminDashboardPage() {
  const headersList = await headers();
  const userEmail = headersList.get('x-user-email');
  const userRole = headersList.get('x-user-role');

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="text-neutral-500">Loading dashboard...</div>
      </div>
    }>
      <EnhancedDashboard userEmail={userEmail} userRole={userRole} />
    </Suspense>
  );
}