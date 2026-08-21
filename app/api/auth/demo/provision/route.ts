import { NextResponse } from "next/server";

/**
 * L'endpoint HTTP de provision (service role) a été retiré.
 * Utiliser uniquement : SUPABASE_SERVICE_ROLE_KEY=... npm run seed:demo
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "provision_disabled",
      hint: "Le provisionnement HTTP est désactivé. Lancez npm run seed:demo en local, ou utilisez le mode démo local.",
    },
    { status: 403 }
  );
}
