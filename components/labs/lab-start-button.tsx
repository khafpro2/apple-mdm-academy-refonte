"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function LabStartButton({ slug }: { slug: string }) {
  const router = useRouter();

  function handleStart() {
    router.push(`/labs/${slug}?start=1#session`);
  }

  return (
    <Button type="button" onClick={handleStart}>
      Démarrer le lab
    </Button>
  );
}
