import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

function demoCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  // En build prod servi en HTTP (E2E / localhost), un cookie Secure serait ignoré.
  const secure = siteUrl.startsWith("https://");
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge,
  };
}

/** Active le mode démo local (sans Supabase) — cookie lecture seule côté dashboard. */
export async function POST() {
  const response = NextResponse.json({ ok: true, mode: "local_demo" });
  response.cookies.set(DEMO_SESSION_COOKIE, "1", demoCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_SESSION_COOKIE, "", { ...demoCookieOptions(0), maxAge: 0 });
  return response;
}
