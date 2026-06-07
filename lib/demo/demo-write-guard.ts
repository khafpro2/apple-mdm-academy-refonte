import { getUser } from "@/lib/supabase/server";
import { isDemoUser } from "@/lib/demo/demo-user";

export type DemoWriteBlockReason = "demo_readonly";

export async function blockDemoWrite(): Promise<{ blocked: true; reason: DemoWriteBlockReason } | { blocked: false }> {
  const user = await getUser();
  if (isDemoUser(user)) {
    return { blocked: true, reason: "demo_readonly" };
  }
  return { blocked: false };
}
