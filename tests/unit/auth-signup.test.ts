import assert from "node:assert/strict";
import test from "node:test";
import { mapAuthError } from "../../lib/auth/errors.ts";
import { validatePassword } from "../../lib/auth/password-policy.ts";
import { sanitizeRedirectPath } from "../../lib/auth/url.ts";
import { parseSignupFormData, validateSignupInput } from "../../lib/auth/signup-validation.ts";

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

test("validateSignupInput — champs valides", () => {
  const result = validateSignupInput(validSignup);
  assert.equal(result.ok, true);
});

test("validateSignupInput — email invalide", () => {
  const result = validateSignupInput({ ...validSignup, email: "not-an-email" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /email/i);
    assert.equal(result.field, "email");
  }
});

test("validateSignupInput — champs obligatoires", () => {
  const result = validateSignupInput({ ...validSignup, fullName: "" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.field, "fullName");
});

test("validateSignupInput — mots de passe différents", () => {
  const result = validateSignupInput({ ...validSignup, confirmPassword: "OtherPass1" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /correspondent pas/i);
});

test("validateSignupInput — mot de passe insuffisant", () => {
  const result = validateSignupInput({ ...validSignup, password: "abc", confirmPassword: "abc" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.field, "password");
});

test("validateSignupInput — CGU non acceptées", () => {
  const result = validateSignupInput({ ...validSignup, acceptTerms: false });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.field, "acceptTerms");
});

test("parseSignupFormData — trim des espaces", () => {
  const parsed = parseSignupFormData(
    form({
      email: "  user@example.com  ",
      fullName: "  Jean  ",
      password: "ValidPass1",
      confirmPassword: "ValidPass1",
      acceptTerms: true,
    })
  );
  assert.equal(parsed.email, "user@example.com");
  assert.equal(parsed.fullName, "Jean");
});

test("validatePassword — règles minimales", () => {
  assert.equal(validatePassword("ValidPass1").valid, true);
  assert.equal(validatePassword("short1A").valid, false);
});

test("mapAuthError — compte déjà existant", () => {
  const message = mapAuthError({ message: "User already registered" });
  assert.match(message, /existe déjà/i);
});

test("mapAuthError — erreur fournisseur masquée", () => {
  const message = mapAuthError({ message: "Internal server error XYZ" }, "Impossible de créer le compte pour le moment.");
  assert.equal(message, "Impossible de créer le compte pour le moment.");
});

test("sanitizeRedirectPath — bloque les domaines externes", () => {
  assert.equal(sanitizeRedirectPath("//evil.com"), "/dashboard");
  assert.equal(sanitizeRedirectPath("https://evil.com"), "/dashboard");
  assert.equal(sanitizeRedirectPath("/dashboard"), "/dashboard");
});
