import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/api/auth/demo/provision") {
    return NextResponse.json(
      { ok: false, error: "demo_provision_disabled" },
      { status: 403 }
    );
  }

  if (
    pathname.startsWith("/admin") &&
    request.cookies.get(DEMO_SESSION_COOKIE)?.value === "1"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
