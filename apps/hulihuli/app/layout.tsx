import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Hulihuli | Hawaiian Restaurant',
    template: '%s | Hulihuli',
  },
  description: 'Authentic Hawaiian cuisine with a modern twist. Experience the flavors of the islands at Hulihuli.',
  keywords: ['Hawaiian restaurant', 'Hawaiian food', 'Pacific cuisine', 'Hulihuli', 'island dining'],
  authors: [{ name: 'Hulihuli' }],
  creator: 'Hulihuli',
  publisher: 'Hulihuli',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Hulihuli | Hawaiian Restaurant',
    description: 'Authentic Hawaiian cuisine with a modern twist.',
    url: '/',
    siteName: 'Hulihuli',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
