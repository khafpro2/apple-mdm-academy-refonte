"use client";

import { useSearchParams } from "next/navigation";
import { LabEngine } from "@/components/labs/lab-engine";
import type { Lab } from "@/lib/types";

export function LabDetailClient({
  lab,
  isAuthenticated,
  autoStart: autoStartProp,
}: {
  lab: Lab;
  isAuthenticated: boolean;
  autoStart: boolean;
}) {
  const searchParams = useSearchParams();
  const autoStart = autoStartProp || searchParams.get("start") === "1";

  return <LabEngine lab={lab} isAuthenticated={isAuthenticated} autoStart={autoStart} />;
}
