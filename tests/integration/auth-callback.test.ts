import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const exchangeCodeForSession = vi.fn();
const getUser = vi.fn();
const ensureUserProfile = vi.fn();
const createRouteHandlerClient = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/supabase/route-handler", () => ({
  createRouteHandlerClient: (...args: unknown[]) => createRouteHandlerClient(...args),
  getRedirectOrigin: vi.fn(() => "https://example.test"),
}));

vi.mock("@/lib/supabase/ensure-profile", () => ({
  ensureUserProfile: (...args: unknown[]) => ensureUserProfile(...args),
}));

describe("auth callback route", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
    getUser.mockReset();
    ensureUserProfile.mockReset();
    createRouteHandlerClient.mockReset();
    createRouteHandlerClient.mockReturnValue({
      auth: {
        exchangeCodeForSession,
        getUser,
      },
    });
  });

  it("redirige vers login si code absent", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const request = new NextRequest("https://example.test/auth/callback?redirect=/dashboard");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.test/auth/login?error=auth_callback_failed"
    );
  });

  it("échange le code et redirige en succès", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          user_metadata: { name: "Google User" },
        },
      },
    });
    ensureUserProfile.mockResolvedValue({ ok: true });

    const { GET } = await import("@/app/auth/callback/route");
    const request = new NextRequest(
      "https://example.test/auth/callback?code=abc&redirect=/dashboard"
    );
    const response = await GET(request);
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(ensureUserProfile).toHaveBeenCalledWith(expect.anything(), "user-1", "Google User");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.test/dashboard");
  });

  it("redirige en erreur si l'échange échoue", async () => {
    exchangeCodeForSession.mockResolvedValue({
      error: { code: "invalid_grant", message: "bad code" },
    });

    const { GET } = await import("@/app/auth/callback/route");
    const request = new NextRequest("https://example.test/auth/callback?code=bad");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=auth_callback_failed");
  });
});

describe("signout route", () => {
  beforeEach(() => {
    signOut.mockReset();
    createRouteHandlerClient.mockReset();
    createRouteHandlerClient.mockReturnValue({
      auth: { signOut },
    });
  });

  it("invalide la session et redirige vers l'accueil", async () => {
    const { POST } = await import("@/app/auth/signout/route");
    const request = new NextRequest("https://example.test/auth/signout", { method: "POST" });
    const response = await POST(request);
    expect(signOut).toHaveBeenCalled();
    expect([302, 303, 307, 308]).toContain(response.status);
    expect(response.headers.get("location")).toBe("https://example.test/");
  });
});
