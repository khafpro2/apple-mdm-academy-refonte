import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { getSupabaseEnv } from "@/lib/env";
import { DEMO_USER_EMAIL } from "@/lib/demo/constants";
import { DEMO_USER_PASSWORD } from "@/lib/demo/credentials.server";

/** Connexion au compte démo pré-provisionné (CLI `npm run seed:demo`). Ne crée pas l'utilisateur. */
export async function POST(request: NextRequest) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, response);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "demo_user_missing",
        hint: "Provisionnez le compte avec npm run seed:demo, ou utilisez le mode démo local.",
      },
      { status: 404 }
    );
  }

  return response;
}
