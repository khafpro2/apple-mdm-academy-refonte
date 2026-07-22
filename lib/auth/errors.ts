/** Messages d'erreur auth en français — sans fuite d'information sensible. */

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  email_not_confirmed:
    "Votre email n'est pas encore confirmé. Consultez votre boîte de réception ou renvoyez le lien de confirmation.",
  user_already_exists: "Un compte existe déjà avec cette adresse email.",
  email_exists: "Un compte existe déjà avec cette adresse email.",
  weak_password: "Mot de passe trop faible. Respectez les règles affichées ci-dessous.",
  invalid_email: "Adresse email invalide.",
  signup_disabled: "Les inscriptions sont temporairement désactivées.",
  over_email_send_rate_limit: "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
  over_request_rate_limit: "Trop de requêtes. Réessayez dans quelques instants.",
  email_address_invalid: "Adresse email invalide ou domaine non autorisé.",
  validation_failed: "Les informations saisies sont invalides.",
  user_banned: "Ce compte a été suspendu. Contactez le support.",
  session_expired: "Votre session a expiré. Reconnectez-vous.",
  email_send_failed:
    "Impossible d'envoyer l'email de confirmation. Réessayez plus tard ou contactez le support.",
  unexpected_failure: "Impossible de créer le compte pour le moment. Réessayez dans quelques instants.",
  provider_disabled: "Cette méthode de connexion n'est pas disponible pour le moment.",
  oauth_provider_not_supported: "Ce fournisseur OAuth n'est pas configuré.",
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
  if (
    message.includes("user already registered") ||
    message.includes("already been registered") ||
    message.includes("email address already registered") ||
    message.includes("already exists")
  ) {
    return ERROR_MESSAGES.user_already_exists;
  }
  if (message.includes("signups not allowed") || message.includes("signup is disabled")) {
    return ERROR_MESSAGES.signup_disabled;
  }
  if (
    message.includes("error sending confirmation email") ||
    message.includes("error sending") ||
    message.includes("smtp") ||
    message.includes("unable to send")
  ) {
    return ERROR_MESSAGES.email_send_failed;
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
  if (message.includes("provider is not enabled") || message.includes("unsupported provider")) {
    return ERROR_MESSAGES.provider_disabled;
  }

  return fallback;
}

export function mapAuthCallbackError(code: string | null): string | null {
  switch (code) {
    case "auth_callback_failed":
      return "Échec de la confirmation ou de la connexion. Réessayez ou demandez un nouveau lien.";
    case "supabase_not_configured":
      return "Authentification indisponible — configuration serveur incomplète.";
    case "oauth_denied":
      return "Connexion Google annulée. Vous pouvez réessayer ou utiliser email / mot de passe.";
    default:
      return null;
  }
}
