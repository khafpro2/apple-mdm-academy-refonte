import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.reason === "unauthenticated") {
      redirect("/auth/login?redirect=/admin");
    }
    redirect("/dashboard");
  }

  return children;
}
