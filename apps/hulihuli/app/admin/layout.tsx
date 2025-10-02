import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav user={session.user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
