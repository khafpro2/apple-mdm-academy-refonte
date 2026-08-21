import assert from "node:assert/strict";
import test from "node:test";
import { timingSafeEqualString, verifySharedSecret } from "../../lib/crypto/timing-safe.ts";

test("timingSafeEqualString — égalité", () => {
  assert.equal(timingSafeEqualString("abc123", "abc123"), true);
});

test("timingSafeEqualString — différence", () => {
  assert.equal(timingSafeEqualString("abc123", "abc124"), false);
});

test("timingSafeEqualString — longueurs différentes", () => {
  assert.equal(timingSafeEqualString("ab", "abcd"), false);
});

test("verifySharedSecret — fail-closed si secret manquant", () => {
  assert.equal(verifySharedSecret("anything", undefined), false);
  assert.equal(verifySharedSecret("anything", ""), false);
});

test("verifySharedSecret — accepte le secret attendu", () => {
  assert.equal(verifySharedSecret("super-secret", "super-secret"), true);
  assert.equal(verifySharedSecret("wrong", "super-secret"), false);
});
