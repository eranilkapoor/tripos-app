import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
const title = "TripOS | Travel CRM and DMC Operating System";
const description =
  "TripOS helps travel agencies and DMCs manage leads, quotations, itineraries, bookings, suppliers, operations, finance, B2B agents, and marketing.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "TripOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TripOS",
  applicationCategory: "BusinessApplication",
  description,
  url: siteUrl,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "2000",
    highPrice: "200000",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}

