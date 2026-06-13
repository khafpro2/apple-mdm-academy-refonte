import { NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "kthiam@harmytech.com";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    contactEmail: CONTACT_EMAIL,
    received: Boolean(payload),
  });
}
