import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";
import { sanitizeRedirectPath } from "@/lib/auth/url";
import { DEMO_USER_EMAIL, DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_PAGES = ["/auth/login", "/auth/signup", "/auth/check-email"];

function hasDemoSession(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === "1";
}

export async function updateSession(request: NextRequest) {
  const { url, anonKey, configured } = getSupabaseEnv();
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const demoSession = hasDemoSession(request);

  if (!configured) {
    if (isProtected && !demoSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    if (pathname.startsWith("/dashboard") && demoSession) {
      return supabaseResponse;
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (
    user?.email?.toLowerCase() === DEMO_USER_EMAIL.toLowerCase() &&
    pathname.startsWith("/admin")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if ((user || demoSession) && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = sanitizeRedirectPath(request.nextUrl.searchParams.get("redirect"));
    redirectUrl.searchParams.delete("redirect");
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
