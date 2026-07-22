import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";
import { createDemoSessionCookieValue } from "@/lib/demo/demo-session-cookie";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

/** Active le mode démo local (sans Supabase) — cookie lecture seule côté dashboard. */
export async function POST() {
  const response = NextResponse.json({ ok: true, mode: "local_demo" });
  response.cookies.set(DEMO_SESSION_COOKIE, createDemoSessionCookieValue(), COOKIE_OPTIONS);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
