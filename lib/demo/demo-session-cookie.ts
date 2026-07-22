import { createHmac, timingSafeEqual } from "node:crypto";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

const DEMO_PAYLOAD = "1";

function getDemoSecret(): string | null {
  const secret = process.env.DEMO_SESSION_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : null;
}

/** Valeur cookie démo — signée si DEMO_SESSION_SECRET est défini. */
export function createDemoSessionCookieValue(): string {
  const secret = getDemoSecret();
  if (!secret) return DEMO_PAYLOAD;

  const signature = createHmac("sha256", secret).update(DEMO_PAYLOAD).digest("base64url");
  return `${DEMO_PAYLOAD}.${signature}`;
}

export function isValidDemoSessionCookieValue(value: string | undefined | null): boolean {
  if (!value) return false;

  const secret = getDemoSecret();
  if (!secret) {
    return value === DEMO_PAYLOAD;
  }

  const [payload, signature] = value.split(".");
  if (payload !== DEMO_PAYLOAD || !signature) return false;

  const expected = createHmac("sha256", secret).update(DEMO_PAYLOAD).digest("base64url");
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { DEMO_SESSION_COOKIE };
