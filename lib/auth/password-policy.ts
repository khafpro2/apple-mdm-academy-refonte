/** Règles de mot de passe alignées sur Supabase Auth (minimum 6 côté API, 8 recommandé UX). */

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `Au moins ${PASSWORD_MIN_LENGTH} caractères`,
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "Une lettre majuscule",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "Une lettre minuscule",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "digit",
    label: "Un chiffre",
    test: (p) => /\d/.test(p),
  },
];

export type PasswordValidationResult = {
  valid: boolean;
  failedRules: PasswordRule[];
};

export function validatePassword(password: string): PasswordValidationResult {
  const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password));
  return { valid: failedRules.length === 0, failedRules };
}

export function passwordValidationMessage(result: PasswordValidationResult): string {
  if (result.valid) return "";
  return `Mot de passe invalide : ${result.failedRules.map((r) => r.label.toLowerCase()).join(", ")}.`;
}
