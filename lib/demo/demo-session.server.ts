import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

export async function isDemoSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_SESSION_COOKIE)?.value === "1";
}

export function isDemoSessionRequest(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === "1";
}
