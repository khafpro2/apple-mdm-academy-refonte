/** Comparaison en temps constant pour des chaînes de même alphabet (hex HMAC, secrets). */
export function timingSafeEqualString(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Fail-closed : secret manquant ou vide → refusé. */
export function verifySharedSecret(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!expected) return false;
  return timingSafeEqualString(provided ?? "", expected);
}
