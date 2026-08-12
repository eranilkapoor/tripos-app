import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | TripOS",
  description:
    "How TripOS collects, uses, stores, and protects data for travel agencies, DMCs, their customers, and B2B agents.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <span className="eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="updated">Draft pending legal counsel review. Last updated: 12 August 2026.</p>

        <p>
          TripOS (&quot;TripOS&quot;, &quot;we&quot;, &quot;us&quot;) provides a
          multi-organization travel operations platform used by travel
          agencies, destination management companies, tour operators, and
          their staff, customers, and B2B agents (together, &quot;users&quot;).
          This policy explains what data we collect through this website and
          the TripOS platform, why we collect it, and how it is protected.
        </p>

        <h2>Data we collect</h2>
        <p>
          When you submit a demo request or enquiry on this site, we collect
          the company name, contact name, work email, phone number, business
          type, and any message details you provide. Once an organization is
          onboarded to TripOS, the platform additionally processes business
          data the organization enters or uploads, including lead and
          customer records, quotations, itineraries, bookings, supplier and
          payment records, and travel documents such as passports, visas, and
          tickets uploaded on behalf of travellers.
        </p>

        <h2>How we use data</h2>
        <p>
          We use website enquiry data to respond to demo requests and
          onboarding questions. We use in-platform business data solely to
          operate the TripOS service for the organization that owns it: to
          run CRM, quotation, booking, operations, and finance workflows, to
          provide support, and to maintain audit and security logs.
        </p>

        <h2>Data isolation between organizations</h2>
        <p>
          TripOS is a multi-organization platform. Every organization&apos;s
          business data is logically isolated by organization, and access is
          restricted to authenticated users with a role and permission
          granted within that organization. TripOS staff do not access an
          organization&apos;s data except for support, security
          investigation, or legal compliance purposes.
        </p>

        <h2>Sensitive travel documents</h2>
        <p>
          Passports, visas, tickets, and other identity or travel documents
          uploaded to TripOS are stored as private objects, accessible only
          through authenticated, permission-checked requests, and are not
          publicly listable.
        </p>

        <h2>Cookies</h2>
        <p>
          This website uses only cookies and local storage required for the
          site to function (such as remembering that you accepted this
          notice). We do not load analytics or marketing cookies without your
          consent.
        </p>

        <h2>Data retention and deletion</h2>
        <p>
          Business data is retained for as long as an organization&apos;s
          TripOS subscription is active, plus any additional period required
          by applicable law or the organization&apos;s own retention policy.
          Organizations may request export or deletion of their data subject
          to legal and contractual retention requirements.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or a specific organization&apos;s data
          can be sent through the demo request form on this site, or directly
          to the organization that manages your travel booking.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
