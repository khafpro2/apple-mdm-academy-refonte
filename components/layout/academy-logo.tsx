"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";

type AcademyLogoProps = {
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
};

export function AcademyLogo({ collapsed = false, className = "", onClick }: AcademyLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${className}`}
      aria-label="Apple MDM Academy — Accueil"
    >
      <LogoIcon name="apple" size={collapsed ? 24 : 36} alt="Apple MDM Academy" className="text-black" />

      {!collapsed && (
        <>
          <div className="h-10 w-px shrink-0 bg-slate-300" aria-hidden="true" />

          <div className="min-w-0 leading-none">
            <div className="text-2xl font-bold leading-none text-black">MDM</div>
            <div className="text-lg font-semibold leading-none tracking-wide text-blue-600">ACADEMY</div>
          </div>
        </>
      )}
    </Link>
  );
}
