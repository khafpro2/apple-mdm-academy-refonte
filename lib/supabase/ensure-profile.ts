import type { SupabaseClient } from "@supabase/supabase-js";

/** Crée ou met à jour le profil applicatif — idempotent, sans jamais attribuer is_admin. */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  userId: string,
  fullName?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalizedName = fullName?.trim() || null;

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    console.error("PROFILE_ENSURE_READ_FAILED", { errorCode: readError.code ?? "unknown" });
    return { ok: false, error: "Impossible de créer le compte pour le moment. (réf. PROFILE-READ)" };
  }

  if (existing) {
    if (normalizedName && existing.full_name !== normalizedName) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: normalizedName, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (updateError) {
        console.error("PROFILE_ENSURE_UPDATE_FAILED", { errorCode: updateError.code ?? "unknown" });
      }
    }
    return { ok: true };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: normalizedName,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { ok: true };
    }
    console.error("PROFILE_ENSURE_INSERT_FAILED", { errorCode: insertError.code ?? "unknown" });
    return { ok: false, error: "Impossible de créer le compte pour le moment. (réf. PROFILE-INSERT)" };
  }

  return { ok: true };
}
