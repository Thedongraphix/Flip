import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';

import { siteDetails } from '@/data/siteDetails';
import StyledComponentsRegistry from "./registry";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Flip',
    default: siteDetails.metadata.title,
  },
  description: siteDetails.metadata.description,
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: ['/images/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are imported in globals.css */}
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="antialiased">
        {siteDetails.googleAnalyticsId && <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />}
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
