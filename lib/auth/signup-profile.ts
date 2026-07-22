import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

/**
 * N'appelle ensureUserProfile que si une session existe.
 * Avec confirmation email active, signUp renvoie un user SANS session —
 * l'insert RLS échouerait (auth.uid() NULL). Le profil est alors créé
 * par le trigger SQL handle_new_user, puis finalisé au /auth/callback.
 *
 * En cas d'échec profil alors qu'une session existe : journalise sans PII
 * et n'échoue pas l'inscription (le compte Auth existe réellement).
 */
export async function runSignupProfileEnsure(
  supabase: SupabaseClient,
  data: { session: unknown; user: { id: string } | null },
  fullName: string
): Promise<void> {
  if (!data.session || !data.user) {
    return;
  }

  const profileResult = await ensureUserProfile(supabase, data.user.id, fullName);
  if (profileResult.ok === false) {
    console.error("AUTH_SIGNUP_PROFILE_ENSURE_FAILED", {
      provider: "supabase",
      errorCode: "profile_ensure_failed",
    });
  }
}
