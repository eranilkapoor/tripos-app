import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripOS Admin CRM",
  description: "Travel CRM, DMC operations, B2B agent, quotation, booking, and finance control center.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

