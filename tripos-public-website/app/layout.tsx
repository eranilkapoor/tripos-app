import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripOS | Travel CRM and DMC Operating System",
  description: "TripOS helps travel agencies and DMCs manage leads, quotations, itineraries, bookings, suppliers, operations, finance, B2B agents, and marketing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

