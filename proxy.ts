import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { blockRemovedV1Paths } from "@/lib/v1/block-removed-paths";

export async function proxy(request: NextRequest) {
  const blocked = blockRemovedV1Paths(request);
  if (blocked) return blocked;
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
