import { afterEach, describe, expect, it, vi } from "vitest";
import { mapAuthError, mapAuthCallbackError } from "@/lib/auth/errors";
import { validatePassword } from "@/lib/auth/password-policy";
import {
  getAuthCallbackPath,
  getAuthCallbackUrl,
  getAuthCallbackUrlForOrigin,
  getSiteUrl,
  sanitizeRedirectPath,
} from "@/lib/auth/url";
import { parseSignupFormData, validateSignupInput } from "@/lib/auth/signup-validation";
import {
  isPlaceholderValue,
  isSupabaseConfigured,
  validateAnonKey,
  validateSiteUrl,
  validateSupabaseUrl,
} from "@/lib/supabase/env-validation";
import {
  createDemoSessionCookieValue,
  isValidDemoSessionCookieValue,
} from "@/lib/demo/demo-session-cookie";

function form(entries: Record<string, string | boolean>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (typeof value === "boolean") {
      if (value) fd.set(key, "on");
    } else {
      fd.set(key, value);
    }
  }
  return fd;
}

const validSignup = {
  email: "user@example.com",
  password: "ValidPass1",
  confirmPassword: "ValidPass1",
  fullName: "Jean Dupont",
  acceptTerms: true,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("validateSignupInput", () => {
  it("accepte des champs valides", () => {
    expect(validateSignupInput(validSignup).ok).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = validateSignupInput({ ...validSignup, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/email/i);
      expect(result.field).toBe("email");
    }
  });

  it("exige le nom complet", () => {
    const result = validateSignupInput({ ...validSignup, fullName: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe("fullName");
  });

  it("détecte des mots de passe différents", () => {
    const result = validateSignupInput({ ...validSignup, confirmPassword: "OtherPass1" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/correspondent pas/i);
  });

  it("rejette un mot de passe trop faible", () => {
    const result = validateSignupInput({ ...validSignup, password: "abc", confirmPassword: "abc" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe("password");
  });

  it("exige l'acceptation des CGU", () => {
    const result = validateSignupInput({ ...validSignup, acceptTerms: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe("acceptTerms");
  });
});

describe("parseSignupFormData", () => {
  it("trim les espaces", () => {
    const parsed = parseSignupFormData(
      form({
        email: "  user@example.com  ",
        fullName: "  Jean  ",
        password: "ValidPass1",
        confirmPassword: "ValidPass1",
        acceptTerms: true,
      })
    );
    expect(parsed.email).toBe("user@example.com");
    expect(parsed.fullName).toBe("Jean");
  });
});

describe("validatePassword", () => {
  it("applique les règles minimales", () => {
    expect(validatePassword("ValidPass1").valid).toBe(true);
    expect(validatePassword("short1A").valid).toBe(false);
  });
});

describe("mapAuthError", () => {
  it("mappe un compte déjà existant", () => {
    expect(mapAuthError({ message: "User already registered" })).toMatch(/existe déjà/i);
  });

  it("mappe signup_disabled", () => {
    expect(mapAuthError({ code: "signup_disabled" })).toMatch(/désactivées/i);
    expect(mapAuthError({ message: "Signups not allowed for this instance" })).toMatch(/désactivées/i);
  });

  it("mappe un échec d'envoi email", () => {
    expect(mapAuthError({ message: "Error sending confirmation email" })).toMatch(/envoyer l'email/i);
  });

  it("masque les erreurs fournisseur inconnues", () => {
    expect(
      mapAuthError({ message: "Internal server error XYZ" }, "Impossible de créer le compte pour le moment.")
    ).toBe("Impossible de créer le compte pour le moment.");
  });

  it("mappe les erreurs de callback", () => {
    expect(mapAuthCallbackError("auth_callback_failed")).toMatch(/confirmation/i);
    expect(mapAuthCallbackError("oauth_denied")).toMatch(/Google/i);
    expect(mapAuthCallbackError(null)).toBeNull();
  });
});

describe("sanitizeRedirectPath / auth URLs", () => {
  it("bloque les open-redirects", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectPath("https://evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectPath("/courses?x=1")).toBe("/courses?x=1");
  });

  it("construit le chemin callback", () => {
    expect(getAuthCallbackPath("/dashboard")).toBe("/auth/callback?redirect=%2Fdashboard");
  });

  it("utilise NEXT_PUBLIC_SITE_URL pour l'URL complète", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    expect(getAuthCallbackUrl("/dashboard")).toBe(
      "https://example.test/auth/callback?redirect=%2Fdashboard"
    );
    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("préfère l'origine navigateur pour les callbacks OAuth/reset", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://production.example";
    vi.stubGlobal("window", { location: { origin: "http://localhost:3000" } });

    expect(getSiteUrl()).toBe("http://localhost:3000");
    expect(getAuthCallbackUrl("/dashboard")).toBe("http://localhost:3000/auth/callback?redirect=%2Fdashboard");

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("construit un callback depuis une origine de requête serveur", () => {
    expect(getAuthCallbackUrlForOrigin("https://preview.example/", "/dashboard")).toBe(
      "https://preview.example/auth/callback?redirect=%2Fdashboard"
    );
  });
});

describe("env-validation", () => {
  it("détecte les placeholders", () => {
    expect(isPlaceholderValue("your-anon-key")).toBe(true);
    expect(isPlaceholderValue("https://abcd.supabase.co")).toBe(false);
  });

  it("valide URL et clé anon", () => {
    expect(validateSupabaseUrl("https://abcd.supabase.co").state).toBe("configured");
    expect(validateSupabaseUrl("https://your-project.supabase.co").state).toBe("invalid");
    expect(validateAnonKey("short").state).toBe("invalid");
    expect(validateAnonKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo").state).toBe("configured");
    expect(validateSiteUrl("https://app.apple-mdm-academy.test").state).toBe("configured");
    expect(isSupabaseConfigured("https://abcd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo")).toBe(
      true
    );
  });
});

describe("demo session cookie", () => {
  it("accepte la valeur simple sans secret", () => {
    const previous = process.env.DEMO_SESSION_SECRET;
    delete process.env.DEMO_SESSION_SECRET;
    expect(createDemoSessionCookieValue()).toBe("1");
    expect(isValidDemoSessionCookieValue("1")).toBe(true);
    expect(isValidDemoSessionCookieValue("0")).toBe(false);
    process.env.DEMO_SESSION_SECRET = previous;
  });

  it("signe et vérifie avec DEMO_SESSION_SECRET", () => {
    const previous = process.env.DEMO_SESSION_SECRET;
    process.env.DEMO_SESSION_SECRET = "unit-test-secret-16chars";
    const value = createDemoSessionCookieValue();
    expect(value.startsWith("1.")).toBe(true);
    expect(isValidDemoSessionCookieValue(value)).toBe(true);
    expect(isValidDemoSessionCookieValue("1.tampered")).toBe(false);
    process.env.DEMO_SESSION_SECRET = previous;
  });
});
