import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of Service | TripOS",
  description:
    "Terms governing use of the TripOS website and the TripOS travel operations SaaS platform.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <span className="eyebrow">Legal</span>
        <h1>Terms of Service</h1>
        <p className="updated">Draft pending legal counsel review. Last updated: 12 August 2026.</p>

        <p>
          These terms govern use of this website and, once an organization
          signs up, use of the TripOS travel operations platform
          (&quot;Service&quot;). By submitting a demo request or using the
          Service, you agree to these terms on behalf of yourself or the
          organization you represent.
        </p>

        <h2>The Service</h2>
        <p>
          TripOS is a multi-organization SaaS platform for travel agencies,
          destination management companies, tour operators, and B2B travel
          networks to manage leads, quotations, itineraries, bookings,
          suppliers, operations, payments, and marketing. Each subscribing
          organization&apos;s data is isolated from every other
          organization&apos;s data.
        </p>

        <h2>Accounts and access</h2>
        <p>
          Organizations are responsible for the accuracy of information
          provided, for the conduct of users they invite into their TripOS
          workspace, and for maintaining the confidentiality of login
          credentials. Roles and permissions within an organization&apos;s
          workspace are managed by that organization&apos;s administrators.
        </p>

        <h2>Acceptable use</h2>
        <p>
          The Service may not be used to store or process data the
          subscribing organization is not lawfully entitled to hold, to
          attempt to access another organization&apos;s data, to interfere
          with the Service&apos;s operation, or to violate applicable travel,
          consumer protection, or data protection law.
        </p>

        <h2>Fees and plans</h2>
        <p>
          Access to the Service is provided under the plan (Starter,
          Professional, or Enterprise/DMC) selected at signup or agreed in a
          separate order form. Fees, billing cycle, and plan limits are as
          communicated at the time of subscription.
        </p>

        <h2>Data ownership</h2>
        <p>
          Each organization owns the business data it enters into TripOS.
          TripOS acts as a data processor for that data and does not use it
          for purposes other than operating and supporting the Service for
          that organization, except as required by law.
        </p>

        <h2>Availability and support</h2>
        <p>
          We aim to keep the Service available and to respond to support
          requests promptly, but the Service is provided without warranty of
          uninterrupted availability. Planned maintenance windows will be
          communicated in advance where practical.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, TripOS is not liable for
          indirect, incidental, or consequential damages arising from use of
          the Service, including losses arising from third-party supplier,
          payment, or communication provider failures integrated with the
          Service.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Material changes will
          be communicated to active subscribing organizations before taking
          effect.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
