import type { Metadata } from "next";
import "./globals.css";
import CrmShell from "./components/CrmShell";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "TripOS Admin CRM",
  description:
    "Travel CRM, DMC operations, B2B agent, quotation, booking, and finance control center.",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CrmShell />
        </Providers>
      </body>
    </html>
  );
}
