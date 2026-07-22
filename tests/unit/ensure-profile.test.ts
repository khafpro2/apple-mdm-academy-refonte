import assert from "node:assert/strict";
import test, { mock } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureUserProfile } from "../../lib/supabase/ensure-profile.ts";
import { runSignupProfileEnsure } from "../../lib/auth/signup-profile.ts";
import { mapAuthCallbackError } from "../../lib/auth/errors.ts";

type QueryResult = {
  data?: { id: string; full_name: string | null } | null;
  error?: { code?: string; message?: string } | null;
};

function createMockSupabase(handlers: {
  select?: () => QueryResult | Promise<QueryResult>;
  insert?: () => { error?: { code?: string; message?: string } | null };
  update?: () => { error?: { code?: string; message?: string } | null };
}) {
  const insertCalls: unknown[] = [];
  const updateCalls: unknown[] = [];

  const supabase = {
    from(table: string) {
      assert.equal(table, "profiles");
      return {
        select() {
          return {
            eq() {
              return {
                maybeSingle: async () => handlers.select?.() ?? { data: null, error: null },
              };
            },
          };
        },
        insert(payload: unknown) {
          insertCalls.push(payload);
          return handlers.insert?.() ?? { error: null };
        },
        update(payload: unknown) {
          updateCalls.push(payload);
          return {
            eq() {
              return handlers.update?.() ?? { error: null };
            },
          };
        },
      };
    },
    _insertCalls: insertCalls,
    _updateCalls: updateCalls,
  };

  return supabase as unknown as SupabaseClient & {
    _insertCalls: unknown[];
    _updateCalls: unknown[];
  };
}

test("ensureUserProfile — insert refusé RLS (42501) => ok:false", async () => {
  const supabase = createMockSupabase({
    select: () => ({ data: null, error: null }),
    insert: () => ({ error: { code: "42501", message: "new row violates row-level security policy" } }),
  });

  const result = await ensureUserProfile(supabase, "user-1", "Jean");
  assert.equal(result.ok, false);
  if (result.ok === false) {
    assert.match(result.error, /Impossible de créer le compte/i);
  }
  assert.equal(supabase._insertCalls.length, 1);
});

test("ensureUserProfile — conflit 23505 => ok:true", async () => {
  const supabase = createMockSupabase({
    select: () => ({ data: null, error: null }),
    insert: () => ({ error: { code: "23505", message: "duplicate key value" } }),
  });

  const result = await ensureUserProfile(supabase, "user-1", "Jean");
  assert.equal(result.ok, true);
});

test("ensureUserProfile — profil existant => pas d'insert", async () => {
  const supabase = createMockSupabase({
    select: () => ({ data: { id: "user-1", full_name: "Jean" }, error: null }),
  });

  const result = await ensureUserProfile(supabase, "user-1", "Jean");
  assert.equal(result.ok, true);
  assert.equal(supabase._insertCalls.length, 0);
});

test("runSignupProfileEnsure — sans session ne doit jamais retourner d'erreur profil", async () => {
  let ensureCalled = false;
  const supabase = createMockSupabase({
    select: () => {
      ensureCalled = true;
      return { data: null, error: null };
    },
    insert: () => ({ error: { code: "42501", message: "rls" } }),
  });

  await runSignupProfileEnsure(
    supabase,
    { session: null, user: { id: "user-1" } },
    "Jean Dupont"
  );

  assert.equal(ensureCalled, false);
  assert.equal(supabase._insertCalls.length, 0);
});

test("runSignupProfileEnsure — avec session et échec profil : ne propage pas d'erreur", async () => {
  const errors: unknown[] = [];
  const restore = mock.method(console, "error", (...args: unknown[]) => {
    errors.push(args);
  });

  const supabase = createMockSupabase({
    select: () => ({ data: null, error: null }),
    insert: () => ({ error: { code: "42501", message: "rls" } }),
  });

  await runSignupProfileEnsure(
    supabase,
    { session: { access_token: "tok" }, user: { id: "user-1" } },
    "Jean Dupont"
  );

  assert.equal(supabase._insertCalls.length, 1);
  assert.ok(errors.some((entry) => Array.isArray(entry) && entry[0] === "AUTH_SIGNUP_PROFILE_ENSURE_FAILED"));
  const payload = (errors.find((entry) => Array.isArray(entry) && entry[0] === "AUTH_SIGNUP_PROFILE_ENSURE_FAILED") as unknown[])[1] as Record<
    string,
    unknown
  >;
  assert.equal(payload.provider, "supabase");
  assert.equal("userId" in payload, false);
  assert.equal("email" in payload, false);

  restore.mock.restore();
});

test("mapAuthCallbackError — consentement Google refusé", () => {
  assert.match(mapAuthCallbackError("access_denied") ?? "", /consentement|refusé|annul/i);
});
