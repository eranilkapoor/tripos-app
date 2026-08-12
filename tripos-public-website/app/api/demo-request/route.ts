import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Single-instance in-memory rate limit. Sufficient for the current
// deployment scale (one Next.js instance); revisit with a shared store
// (e.g. Redis) if the site is ever deployed behind multiple instances.
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => t > windowStart);
  recent.push(now);
  submissionsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function clientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

const triposApiUrl =
  process.env.TRIPOS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api/v1";
const publicLeadIntakeToken = process.env.PUBLIC_LEAD_INTAKE_TOKEN;

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as {
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    businessType?: string;
    monthlyBookings?: string;
    website?: string;
  };

  // Honeypot: a hidden field real visitors never see or fill. Bots that
  // auto-fill every form field on the page tend to fill it too. Report
  // success without forwarding so bots don't learn the submission failed.
  if (payload.website) {
    return NextResponse.json({ message: "Demo request captured." });
  }

  if (!payload.companyName || !payload.contactName || !payload.email) {
    return NextResponse.json(
      { message: "Company name, contact name, and email are required." },
      { status: 400 },
    );
  }

  const response = await fetch(`${triposApiUrl}/public/leads`, {
    body: JSON.stringify({
      customerName: payload.companyName,
      email: payload.email,
      phone: payload.phone,
      source: "public-website",
      channel: payload.businessType === "B2B Travel Network" ? "b2b" : "b2c",
      requirement: {
        budget: payload.monthlyBookings
          ? `${payload.monthlyBookings} monthly bookings`
          : undefined,
      },
      metadata: {
        contactName: payload.contactName,
        businessType: payload.businessType,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      ...(publicLeadIntakeToken
        ? { "x-public-intake-token": publicLeadIntakeToken }
        : {}),
    },
    method: "POST",
  });

  const result = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!response.ok) {
    return NextResponse.json(
      { message: result.message ?? "Demo request failed." },
      { status: response.status },
    );
  }

  return NextResponse.json({
    message: result.message ?? "Demo request sent to TripOS.",
  });
}
