import { headers } from 'next/headers';
import { Container, Section, Card, Grid } from '@restaurant-platform/web-common';
import Link from 'next/link';

export default function AdminDashboard() {
  const headersList = headers();
  const userEmail = headersList.get('x-user-email');
  const userRole = headersList.get('x-user-role');

  const adminCards = [
    {
      title: 'Menu Management',
      description: 'Edit menu items, sections, and pricing',
      href: '/admin/menu',
      icon: '📝',
      requiredRole: 'EDITOR',
    },
    {
      title: 'Operating Hours',
      description: 'Update restaurant hours and special closures',
      href: '/admin/hours',
      icon: '🕐',
      requiredRole: 'EDITOR',
    },
    {
      title: 'Contact Info',
      description: 'Manage contact information and social links',
      href: '/admin/contact',
      icon: '📞',
      requiredRole: 'EDITOR',
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions',
      href: '/admin/users',
      icon: '👥',
      requiredRole: 'ADMIN',
    },
    {
      title: 'Analytics',
      description: 'View website traffic and performance',
      href: '/admin/analytics',
      icon: '📊',
      requiredRole: 'VIEWER',
    },
    {
      title: 'Settings',
      description: 'Configure website settings',
      href: '/admin/settings',
      icon: '⚙️',
      requiredRole: 'ADMIN',
    },
  ];

  const hasAccess = (requiredRole: string) => {
    if (userRole === 'ADMIN') return true;
    if (userRole === 'EDITOR' && (requiredRole === 'EDITOR' || requiredRole === 'VIEWER')) return true;
    if (userRole === 'VIEWER' && requiredRole === 'VIEWER') return true;
    return false;
  };

  const accessibleCards = adminCards.filter(card => hasAccess(card.requiredRole));

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900">
                Admin Dashboard
              </h1>
              <p className="text-neutral-600 mt-2">
                Welcome back, {userEmail}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                View Site
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          <Grid cols={3} gap="md" responsive>
            {accessibleCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <Card 
                  padding="lg" 
                  variant="bordered"
                  className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-neutral-600">
                    {card.description}
                  </p>
                </Card>
              </Link>
            ))}
          </Grid>

          {userRole && (
            <div className="mt-8 text-sm text-neutral-500">
              Logged in as: {userRole}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}