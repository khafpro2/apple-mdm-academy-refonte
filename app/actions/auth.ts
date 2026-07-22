"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthCallbackUrl, sanitizeRedirectPath } from "@/lib/auth/url";
import { mapAuthError } from "@/lib/auth/errors";
import { parseSignupFormData, validateSignupInput } from "@/lib/auth/signup-validation";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

export type AuthActionState = {
  ok: boolean;
  error?: string;
  message?: string;
  field?: string;
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
  const redirectTo = getRedirectFromForm(formData);
  const validation = validateSignupInput(parseSignupFormData(formData));

  if (validation.ok === false) {
    return { ok: false, error: validation.error, field: validation.field };
  }

  const { email, password, fullName } = validation.data;

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
    return { ok: false, error: mapAuthError(error, "Impossible de créer le compte pour le moment.") };
  }

  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    logAuthFailure("signup", "duplicate_email");
    return {
      ok: false,
      error: "Un compte existe déjà avec cette adresse email. Connectez-vous ou réinitialisez votre mot de passe.",
      field: "email",
    };
  }

  // Avec confirmation email, signUp n'établit souvent aucune session :
  // RLS bloque alors ensureUserProfile. Le trigger SQL + /auth/callback
  // créent / finalisent le profil — ne pas faire échouer l'inscription.
  if (data.user && data.session) {
    const profileResult = await ensureUserProfile(supabase, data.user.id, fullName);
    if (profileResult.ok === false) {
      console.error("PROFILE_ENSURE_SIGNUP_FAILED", { errorCode: "profile_ensure_failed" });
      return { ok: false, error: profileResult.error };
    }
  } else if (data.user && !data.session) {
    console.info("AUTH_SIGNUP_PENDING_CONFIRMATION", { provider: "supabase" });
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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logAuthFailure("login", error.code);
    return { ok: false, error: mapAuthError(error) };
  }

  if (data.user) {
    const fullName =
      (data.user.user_metadata?.full_name as string | undefined) ??
      (data.user.user_metadata?.name as string | undefined) ??
      (data.user.user_metadata?.fullName as string | undefined) ??
      null;
    await ensureUserProfile(supabase, data.user.id, fullName);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
