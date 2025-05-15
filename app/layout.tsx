import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from './providers';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Pickle - B2B Food Marketplace',
  description: 'Connect with quality food suppliers for your business',
  // Add content type to metadata
  other: {
    'content-type': 'text/html; charset=utf-8',
  },
};

// This is a special Next.js function that allows us to modify the initial HTML
// that is sent to the client. We use it to add a script that will help with hydration.
export function generateStaticParams() {
  return [];
}

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
