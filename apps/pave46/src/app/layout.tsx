import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@restaurant-platform/web-common/src/styles/globals.css';
import './globals.css';

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
    default: 'Pavé46 | French Bistro in Hudson Square',
    template: '%s | Pavé46',
  },
  description: 'An intimate neighborhood cocktail bar in Hudson Square, blending Parisian charm with impeccable service. Discover curated wines, craft cocktails, and refined small plates.',
  keywords: ['French restaurant', 'Hudson Square', 'cocktail bar', 'wine bar', 'NYC restaurant', 'Pavé46'],
  authors: [{ name: 'Pavé46' }],
  creator: 'Pavé46',
  publisher: 'Pavé46',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Pavé46 | French Bistro in Hudson Square',
    description: 'An intimate neighborhood cocktail bar blending Parisian charm with impeccable service.',
    url: '/',
    siteName: 'Pavé46',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pavé46 Restaurant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pavé46 | French Bistro in Hudson Square',
    description: 'An intimate neighborhood cocktail bar blending Parisian charm with impeccable service.',
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
        {children}
      </body>
    </html>
  );
}