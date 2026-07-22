import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";
import { isValidDemoSessionCookieValue } from "@/lib/demo/demo-session-cookie";

export async function isDemoSession(): Promise<boolean> {
  const store = await cookies();
  return isValidDemoSessionCookieValue(store.get(DEMO_SESSION_COOKIE)?.value);
}

export function isDemoSessionRequest(request: NextRequest): boolean {
  return isValidDemoSessionCookieValue(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
}
