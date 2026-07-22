import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient, getRedirectOrigin } from "@/lib/supabase/route-handler";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

export async function POST(request: NextRequest) {
  const origin = getRedirectOrigin(request);
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });
  const supabase = createRouteHandlerClient(request, response);

  if (supabase) {
    await supabase.auth.signOut();
  }

  // Efface aussi la session démo locale (cookie ama_demo_session).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: siteUrl.startsWith("https://"),
    path: "/",
    maxAge: 0,
  });

  return response;
}
