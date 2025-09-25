import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { Anton, Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import type React from 'react';
import { Suspense } from 'react';
import './globals.css';

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${anton.variable} ${GeistMono.variable}`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EVQFZGESN9"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EVQFZGESN9', {
              cookie_domain: 'auto',
              send_page_view: false
            });
          `}
        </Script>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
