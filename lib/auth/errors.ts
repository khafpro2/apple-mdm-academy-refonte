/** Messages d'erreur auth en français — sans fuite d'information sensible. */

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  email_not_confirmed:
    "Votre email n'est pas encore confirmé. Consultez votre boîte de réception ou renvoyez le lien de confirmation.",
  user_already_exists: "Un compte existe déjà avec cette adresse email.",
  weak_password: "Mot de passe trop faible. Respectez les règles affichées ci-dessous.",
  invalid_email: "Adresse email invalide.",
  signup_disabled: "Les inscriptions sont temporairement désactivées.",
  over_email_send_rate_limit: "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
  over_request_rate_limit: "Trop de requêtes. Réessayez dans quelques instants.",
  email_address_invalid: "Adresse email invalide ou domaine non autorisé.",
  validation_failed: "Les informations saisies sont invalides.",
  user_banned: "Ce compte a été suspendu. Contactez le support.",
  session_expired: "Votre session a expiré. Reconnectez-vous.",
};

export function mapAuthError(error: AuthErrorLike | null | undefined, fallback = "Une erreur est survenue."): string {
  if (!error) return fallback;

  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }

  const message = error.message?.toLowerCase() ?? "";

  if (message.includes("invalid login credentials")) {
    return ERROR_MESSAGES.invalid_credentials;
  }
  if (message.includes("email not confirmed")) {
    return ERROR_MESSAGES.email_not_confirmed;
  }
  if (message.includes("user already registered") || message.includes("already been registered")) {
    return ERROR_MESSAGES.user_already_exists;
  }
  if (message.includes("password") && (message.includes("weak") || message.includes("short"))) {
    return ERROR_MESSAGES.weak_password;
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return ERROR_MESSAGES.over_request_rate_limit;
  }
  if (message.includes("invalid email")) {
    return ERROR_MESSAGES.invalid_email;
  }

  return error.message ?? fallback;
}

export function mapAuthCallbackError(code: string | null): string | null {
  switch (code) {
    case "auth_callback_failed":
      return "Échec de la confirmation ou de la connexion. Réessayez ou demandez un nouveau lien.";
    case "supabase_not_configured":
      return "Authentification indisponible — configuration serveur incomplète.";
    default:
      return null;
  }
}
