"use client";

import { FormEvent, useState } from "react";

const modules = [
  ["Travel CRM", "Leads, customers, follow-ups, sales owners, source tracking, and conversion reporting."],
  ["Quotation Engine", "Hotels, transfers, activities, markups, taxes, discounts, PDFs, WhatsApp, and email."],
  ["DMC Operations", "Supplier confirmations, vouchers, drivers, guides, tickets, trip monitoring, and issues."],
  ["B2B Agents", "Agent KYC, credit limits, commissions, enquiries, bookings, invoices, and vouchers inside CRM."],
  ["Travel Finance", "Receivables, payables, refunds, commissions, GST/tax, and profit per booking."],
  ["Marketing ROI", "Campaign source analytics from lead to quote, booking, revenue, and repeat sales."],
];

const plans = [
  ["Starter", "CRM, leads, customers, tasks, quotations, itinerary PDFs, and basic reports."],
  ["Professional", "CRM, suppliers, operations, finance, WhatsApp, B2B agent management, and dashboards."],
  ["Enterprise DMC", "Multi-branch, white-label, multi-currency, API integrations, advanced analytics, and AI."],
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function HomePage() {
  const [status, setStatus] = useState("Ready to capture travel SaaS demo requests.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      companyName: String(formData.get("companyName") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      businessType: String(formData.get("businessType") ?? ""),
      monthlyBookings: String(formData.get("monthlyBookings") ?? ""),
    };

    try {
      setIsSubmitting(true);
      setStatus("Sending demo request...");
      const response = await fetch(`${apiBaseUrl}/tripos/demo-leads`, {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Demo request failed");
      setStatus(result.message ?? "Demo request sent to TripOS.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Demo request is ready to retry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TripOS home">
          <span>T</span>
          <strong>TripOS</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#modules">Modules</a>
          <a href="#plans">Plans</a>
          <a href="#demo">Demo</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Travel CRM + DMC ERP + B2B/B2C SaaS</p>
            <h1>TripOS</h1>
            <p>
              A travel operating system for agencies and DMCs to manage leads, quotations,
              itineraries, bookings, suppliers, operations, payments, B2B agents, and marketing
              from one white-label platform.
            </p>
            <div className="actions">
              <a className="button primary" href="#demo">Schedule demo</a>
              <a className="button secondary" href="#modules">Explore modules</a>
            </div>
          </div>
          <div className="hero-media" aria-label="Travel CRM dashboard preview">
            <div className="travel-card">
              <span>Dubai Family Holiday</span>
              <strong>INR 1,29,500</strong>
              <p>Lead &gt; Quote &gt; Advance &gt; Booking &gt; Voucher</p>
            </div>
            <div className="route-line">
              <span>CRM</span>
              <span>Quote</span>
              <span>Ops</span>
              <span>Profit</span>
            </div>
          </div>
        </section>

        <section className="band" id="modules">
          <div className="section-head">
            <span className="eyebrow">Modules</span>
            <h2>Built for the full travel business lifecycle</h2>
          </div>
          <div className="grid">
            {modules.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="band split">
          <div>
            <span className="eyebrow">MVP Focus</span>
            <h2>Start with custom holidays, not OTA complexity</h2>
            <p>
              TripOS v1 focuses on the workflows travel companies actually lose money on:
              missed leads, slow quotations, supplier follow-ups, payment gaps, and unclear
              booking profitability.
            </p>
          </div>
          <ul className="workflow">
            <li>Marketing lead captured</li>
            <li>Sales owner assigned</li>
            <li>AI-assisted quote drafted</li>
            <li>Booking and payment tracked</li>
            <li>Operations team executes trip</li>
          </ul>
        </section>

        <section className="band" id="plans">
          <div className="section-head">
            <span className="eyebrow">Packaging</span>
            <h2>SaaS plans for agencies, operators, and DMCs</h2>
          </div>
          <div className="plans">
            {plans.map(([label, body]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{label}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="band split" id="demo">
          <div>
            <span className="eyebrow">Demo</span>
            <h2>Digitize your travel business</h2>
            <p>
              Use this public site to capture agency, DMC, and B2B travel network leads
              directly into TripOS CRM.
            </p>
          </div>
          <form className="lead-form" onSubmit={submitDemoRequest}>
            <input name="companyName" placeholder="Company name" required />
            <input name="contactName" placeholder="Contact name" required />
            <input name="email" placeholder="Work email" type="email" required />
            <input name="phone" placeholder="Phone / WhatsApp" />
            <select name="businessType" defaultValue="">
              <option value="" disabled>Business type</option>
              <option>Travel Agency</option>
              <option>DMC</option>
              <option>Tour Operator</option>
              <option>B2B Travel Network</option>
            </select>
            <input name="monthlyBookings" placeholder="Monthly bookings" />
            <button className="button primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Sending..." : "Request demo"}
            </button>
            <p>{status}</p>
          </form>
        </section>
      </main>
    </>
  );
}
