import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

/** Client Supabase pour Route Handlers — cookies attachés à la Response (requis PKCE/callback). */
export function createRouteHandlerClient(
  request: NextRequest,
  response: NextResponse
) {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return null;

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

/** Origin correct sur Vercel (x-forwarded-host) et en local. */
export function getRedirectOrigin(request: Request): string {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NODE_ENV === "development") {
    return origin;
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? origin;
}
