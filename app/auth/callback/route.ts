import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth/url";
import { createRouteHandlerClient, getRedirectOrigin } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRedirectOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const redirect = sanitizeRedirectPath(requestUrl.searchParams.get("redirect"));

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
  }

  const response = NextResponse.redirect(`${origin}${redirect}`);
  const supabase = createRouteHandlerClient(request, response);

  if (!supabase) {
    return NextResponse.redirect(`${origin}/auth/login?error=supabase_not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
  }

  return response;
}
