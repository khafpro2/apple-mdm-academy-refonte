import assert from "node:assert/strict";
import test, { mock } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureUserProfile } from "../../lib/supabase/ensure-profile.ts";
import { shouldEnsureProfileAfterSignup } from "../../lib/auth/signup-profile.ts";
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
  const errors: unknown[] = [];
  const restore = mock.method(console, "error", (...args: unknown[]) => {
    errors.push(args);
  });

  const supabase = createMockSupabase({
    select: () => ({ data: null, error: null }),
    insert: () => ({ error: { code: "42501", message: "new row violates row-level security policy" } }),
  });

  const result = await ensureUserProfile(supabase, "user-1", "Jean");
  assert.equal(result.ok, false);
  if (result.ok === false) {
    assert.match(result.error, /PROFILE-INSERT/);
  }
  assert.equal(supabase._insertCalls.length, 1);

  const insertLog = errors.find((entry) => Array.isArray(entry) && entry[0] === "PROFILE_ENSURE_INSERT_FAILED") as
    | unknown[]
    | undefined;
  assert.ok(insertLog);
  assert.equal("userId" in (insertLog[1] as object), false);

  restore.mock.restore();
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

test("ensureUserProfile — lecture échouée => réf. PROFILE-READ", async () => {
  const errors: unknown[] = [];
  const restore = mock.method(console, "error", (...args: unknown[]) => {
    errors.push(args);
  });

  const supabase = createMockSupabase({
    select: () => ({ data: null, error: { code: "42501", message: "rls" } }),
  });

  const result = await ensureUserProfile(supabase, "user-1", "Jean");
  assert.equal(result.ok, false);
  if (result.ok === false) {
    assert.match(result.error, /PROFILE-READ/);
  }
  const readLog = errors.find((entry) => Array.isArray(entry) && entry[0] === "PROFILE_ENSURE_READ_FAILED") as
    | unknown[]
    | undefined;
  assert.ok(readLog);
  assert.equal("userId" in (readLog[1] as object), false);

  restore.mock.restore();
});

test("signUp sans session — ensureUserProfile ne doit jamais être appelé (régression RLS)", () => {
  assert.equal(shouldEnsureProfileAfterSignup(null, { id: "user-1" }), false);
  assert.equal(shouldEnsureProfileAfterSignup(undefined, { id: "user-1" }), false);
  assert.equal(shouldEnsureProfileAfterSignup({ access_token: "t" }, null), false);
  assert.equal(shouldEnsureProfileAfterSignup({ access_token: "t" }, { id: "user-1" }), true);
});

test("mapAuthCallbackError — consentement Google refusé", () => {
  assert.match(mapAuthCallbackError("access_denied") ?? "", /consentement|refusé|annul/i);
});
