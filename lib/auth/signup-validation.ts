import { passwordValidationMessage, validatePassword } from "@/lib/auth/password-policy";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  acceptTerms: boolean;
};

export type SignupValidationResult =
  | { ok: true; data: SignupInput }
  | { ok: false; error: string; field?: keyof SignupInput | "acceptTerms" };

function trimField(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

export function parseSignupFormData(formData: FormData): SignupInput {
  return {
    email: trimField(formData.get("email")),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    fullName: trimField(formData.get("fullName")),
    acceptTerms: formData.get("acceptTerms") === "on",
  };
}

export function validateSignupInput(input: SignupInput): SignupValidationResult {
  if (!input.fullName) {
    return { ok: false, error: "Le nom complet est requis.", field: "fullName" };
  }

  if (!input.email) {
    return { ok: false, error: "L'adresse email est requise.", field: "email" };
  }

  if (!EMAIL_PATTERN.test(input.email)) {
    return { ok: false, error: "Adresse email invalide.", field: "email" };
  }

  if (!input.acceptTerms) {
    return { ok: false, error: "Vous devez accepter les conditions d'utilisation.", field: "acceptTerms" };
  }

  const passwordCheck = validatePassword(input.password);
  if (!passwordCheck.valid) {
    return {
      ok: false,
      error: passwordValidationMessage(passwordCheck),
      field: "password",
    };
  }

  if (input.password !== input.confirmPassword) {
    return { ok: false, error: "Les mots de passe ne correspondent pas.", field: "confirmPassword" };
  }

  return { ok: true, data: input };
}
