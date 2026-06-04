import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient, getRedirectOrigin } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const origin = getRedirectOrigin(request);
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });
  const supabase = createRouteHandlerClient(request, response);

  if (supabase) {
    await supabase.auth.signOut();
  }

  return response;
}
