import { DEMO_USER_EMAIL } from "@/lib/demo/constants";

export function isDemoUserEmail(email?: string | null): boolean {
  return email?.toLowerCase() === DEMO_USER_EMAIL.toLowerCase();
}

export function isDemoUser(user?: { email?: string | null } | null): boolean {
  return isDemoUserEmail(user?.email);
}
