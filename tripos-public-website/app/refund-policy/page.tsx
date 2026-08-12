import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | TripOS",
  description:
    "How TripOS SaaS subscription refunds and cancellations work. Trip and booking refunds are managed by the booking organization, not TripOS.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <span className="eyebrow">Legal</span>
        <h1>Refund and Cancellation Policy</h1>
        <p className="updated">Draft pending legal counsel review. Last updated: 12 August 2026.</p>

        <p>
          This policy covers two distinct kinds of refunds: refunds for a
          TripOS SaaS subscription, and refunds for a travel booking made by
          an organization using TripOS. These are handled separately.
        </p>

        <h2>TripOS subscription cancellation</h2>
        <p>
          An organization may cancel its TripOS subscription at any time
          through its account administrator or by contacting TripOS support.
          Cancellation stops future billing at the end of the current billing
          cycle; TripOS does not prorate or refund the current billing cycle
          except where required by law or agreed in a separate order form.
        </p>

        <h2>TripOS subscription refunds</h2>
        <p>
          If a subscription was billed in error, or the Service was
          materially unavailable for a sustained period due to a fault on
          TripOS&apos;s side, contact TripOS support to request a review. Approved
          refunds are issued to the original payment method within a
          reasonable period.
        </p>

        <h2>Travel booking refunds and cancellations</h2>
        <p>
          TripOS is operating software used by travel agencies, DMCs, and
          tour operators to run their own businesses. Refunds and
          cancellations for a specific trip, quotation, or booking are
          governed by the cancellation policy of the travel organization you
          booked with, and by the terms of the underlying suppliers (hotels,
          airlines, transport, activity providers) involved in that booking.
          TripOS does not hold, control, or guarantee refunds for travel
          bookings made through organizations using the platform.
        </p>

        <h2>Payment gateway and processing fees</h2>
        <p>
          Where a booking or subscription payment was processed through a
          third-party payment gateway, any gateway processing fees may be
          non-refundable, consistent with that gateway&apos;s own terms.
        </p>

        <h2>Contact</h2>
        <p>
          For TripOS subscription billing questions, contact TripOS support
          through the demo request form on this site. For a specific trip or
          booking refund, contact the travel organization you booked your
          trip with directly.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
