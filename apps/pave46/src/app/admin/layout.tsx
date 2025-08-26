import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DevModeIndicator } from '@/components/admin/DevModeIndicator';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  const nextAuthSession = cookieStore.get('next-auth.session-token');
  const devBypass = cookieStore.get('dev-bypass-active');

  // Check for any valid authentication
  if (!authToken && !nextAuthSession && !devBypass) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <header className="bg-white shadow-sm border-b">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">
                  Pavé Admin
                </h1>
                <div className="flex items-center gap-4">
                  <a
                    href="/"
                    target="_blank"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Site →
                  </a>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
      <DevModeIndicator />
    </div>
  );
}