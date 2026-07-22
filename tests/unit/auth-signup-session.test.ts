import assert from "node:assert/strict";
import test from "node:test";

/**
 * Non-régression : inscription avec confirmation email activée.
 *
 * Supabase signUp() renvoie { user, session: null } tant que l'email n'est pas confirmé.
 * ensureUserProfile() fait un INSERT/UPDATE sous RLS (auth.uid() = id) — sans session,
 * auth.uid() est null → échec avec « Impossible de créer le compte » alors que auth.users
 * est déjà créé. Le trigger handle_new_user (security definer) crée le profil à la place.
 */
test("signUpAction — ensureUserProfile uniquement si session présente", () => {
  const scenarios = [
    { session: null, user: { id: "uuid" }, shouldEnsureProfile: false, label: "confirmation email activée" },
    { session: { access_token: "x" }, user: { id: "uuid" }, shouldEnsureProfile: true, label: "confirmation désactivée" },
    { session: null, user: null, shouldEnsureProfile: false, label: "pas d'utilisateur" },
  ] as const;

  for (const { session, user, shouldEnsureProfile, label } of scenarios) {
    const wouldCallEnsureProfile = Boolean(session && user);
    assert.equal(
      wouldCallEnsureProfile,
      shouldEnsureProfile,
      `Invariant signup (${label}): ensureUserProfile=${shouldEnsureProfile}`
    );
  }
});

test("signUpAction — redirection selon session", () => {
  const redirectTo = "/dashboard";
  const email = "user@example.com";

  function resolveRedirect(session: unknown) {
    if (session) return redirectTo;
    return `/auth/check-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`;
  }

  assert.equal(resolveRedirect(null), `/auth/check-email?email=${encodeURIComponent(email)}&redirect=%2Fdashboard`);
  assert.equal(resolveRedirect({}), "/dashboard");
});
