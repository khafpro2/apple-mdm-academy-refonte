"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthCallbackUrl, sanitizeRedirectPath } from "@/lib/auth/url";
import { mapAuthError } from "@/lib/auth/errors";
import { passwordValidationMessage, validatePassword } from "@/lib/auth/password-policy";

export type AuthActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

function logAuthFailure(action: "signup" | "login", errorCode?: string) {
  console.error(`AUTH_${action.toUpperCase()}_FAILED`, {
    provider: "supabase",
    errorCode: errorCode ?? "unknown",
  });
}

function getRedirectFromForm(formData: FormData): string {
  const raw = formData.get("redirect");
  return sanitizeRedirectPath(typeof raw === "string" ? raw : null);
}

export async function signUpAction(_prev: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const acceptTerms = formData.get("acceptTerms") === "on";
  const redirectTo = getRedirectFromForm(formData);

  if (!email) {
    return { ok: false, error: "L'adresse email est requise." };
  }

  if (!fullName) {
    return { ok: false, error: "Le nom complet est requis." };
  }

  if (!acceptTerms) {
    return { ok: false, error: "Vous devez accepter les conditions d'utilisation." };
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return { ok: false, error: passwordValidationMessage(passwordCheck) };
  }

  if (password !== confirmPassword) {
    return { ok: false, error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase non configuré. Ajoutez vos clés dans .env.local ou Vercel.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: getAuthCallbackUrl(redirectTo),
    },
  });

  if (error) {
    logAuthFailure("signup", error.code);
    return { ok: false, error: mapAuthError(error) };
  }

  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    logAuthFailure("signup", "duplicate_email");
    return {
      ok: false,
      error: "Un compte existe déjà avec cette adresse email. Connectez-vous ou réinitialisez votre mot de passe.",
    };
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect(redirectTo);
  }

  redirect(`/auth/check-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`);
}

export async function signInAction(_prev: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getRedirectFromForm(formData);

  if (!email || !password) {
    return { ok: false, error: "Email et mot de passe requis." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase non configuré. Ajoutez vos clés dans .env.local ou Vercel.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logAuthFailure("login", error.code);
    return { ok: false, error: mapAuthError(error) };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
