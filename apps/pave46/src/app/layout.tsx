import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@restaurant-platform/web-common/src/styles/globals.css';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Pavé | European-Style Café & Bakery in Midtown Manhattan',
    template: '%s | Pavé',
  },
  description: 'European-style café and bakery in Midtown Manhattan. Fresh baked breads, artisanal sandwiches, and French pastries. Founded by Chef Jonghun Won.',
  keywords: ['French bakery', 'Midtown Manhattan', 'artisanal bread', 'sandwiches', 'pastries', 'Pavé', 'Chef Jonghun Won', 'NYC bakery'],
  authors: [{ name: 'Pavé' }],
  creator: 'Pavé',
  publisher: 'Pavé',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Pavé | European-Style Café & Bakery in Midtown Manhattan',
    description: 'Fresh baked breads, artisanal sandwiches, and French pastries. Founded by Chef Jonghun Won.',
    url: '/',
    siteName: 'Pavé',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pavé Bakery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pavé | European-Style Café & Bakery',
    description: 'Fresh baked breads, artisanal sandwiches, and French pastries in Midtown Manhattan.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}