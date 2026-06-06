import { isFreePlatformMode, PLATFORM_ACCESS } from "@/lib/pricing/platform-access";

export function FreePlatformBanner() {
  if (!isFreePlatformMode()) return null;

  return (
    <div
      role="status"
      className="border-b border-emerald-200/80 bg-emerald-50/90 px-4 py-2 text-center text-xs text-emerald-900"
    >
      {PLATFORM_ACCESS.freeMessage}
    </div>
  );
}
