import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { BillingContent } from "@/components/billing/billing-content";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";

export default function BillingPage() {
  if (isFreePlatformMode()) {
    redirect("/dashboard");
  }

  return (
    <PageShell>
      <BillingContent />
    </PageShell>
  );
}
