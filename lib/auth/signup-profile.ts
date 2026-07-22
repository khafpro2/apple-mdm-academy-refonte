/**
 * Gate d'appel ensureUserProfile après signUp — exporté pour tests de régression.
 * Sans session (confirmation email), ne doit jamais tenter d'insert RLS.
 */
export function shouldEnsureProfileAfterSignup(session: unknown, user: unknown): boolean {
  return Boolean(session && user);
}
