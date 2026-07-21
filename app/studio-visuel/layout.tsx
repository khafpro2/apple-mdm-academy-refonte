import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";

export default async function StudioVisuelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.reason === "unauthenticated") {
      redirect("/auth/login?redirect=/studio-visuel/assets");
    }
    redirect("/dashboard");
  }

  return children;
}
