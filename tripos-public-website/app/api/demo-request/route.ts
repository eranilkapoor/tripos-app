import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    companyName?: string;
    contactName?: string;
    email?: string;
  };

  if (!payload.companyName || !payload.contactName || !payload.email) {
    return NextResponse.json(
      { message: "Company name, contact name, and email are required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "Demo request captured. Connect this route to TripOS API leads next.",
    lead: {
      ...payload,
      source: "tripos-public-website",
      stage: "New",
    },
  });
}

