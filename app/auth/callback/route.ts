import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth/url";
import { createRouteHandlerClient, getRedirectOrigin } from "@/lib/supabase/route-handler";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRedirectOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const redirect = sanitizeRedirectPath(requestUrl.searchParams.get("redirect"));

  if (oauthError === "access_denied") {
    return NextResponse.redirect(`${origin}/auth/login?error=access_denied`);
  }

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
    console.error("AUTH_CALLBACK_FAILED", {
      provider: "supabase",
      errorCode: error.code ?? "unknown",
    });
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const fullName =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.fullName as string | undefined) ??
      null;
    await ensureUserProfile(supabase, user.id, fullName);
  }

  return response;
}
