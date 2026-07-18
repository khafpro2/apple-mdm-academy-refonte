"use client";

import Link from "next/link";

type AcademyLogoProps = {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
};

const sizeMap = {
  sm: { mark: 34, title: "text-sm", subtitle: "text-[10px]" },
  md: { mark: 42, title: "text-base", subtitle: "text-[11px]" },
  lg: { mark: 52, title: "text-lg", subtitle: "text-xs" },
};

function AcademyMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Apple MDM Academy"
      className="shrink-0"
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill="#101827" />
      <rect x="12" y="16" width="25" height="34" rx="4" fill="#f8fafc" opacity="0.96" />
      <rect x="28" y="10" width="24" height="38" rx="5" fill="#dbeafe" />
      <rect x="31" y="15" width="18" height="25" rx="2" fill="#0f172a" opacity="0.14" />
      <path d="M31 29l11-4 11 4v8c0 7-4.7 12.4-11 14-6.3-1.6-11-7-11-14v-8z" fill="#22c55e" />
      <path
        d="M37.3 37.2l3.3 3.3 6.6-7.1"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AcademyLogo({
  variant = "full",
  size = "md",
  collapsed = false,
  className = "",
  onClick,
}: AcademyLogoProps) {
  const dimensions = sizeMap[size];
  const showText = variant === "full" && !collapsed;

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Apple MDM Academy - Accueil"
      className={[
        "inline-flex min-w-0 items-center gap-2 rounded-lg text-left",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      ].join(" ")}
    >
      <AcademyMark size={dimensions.mark} />
      {showText && (
        <span className="min-w-0 leading-tight">
          <span className={`block font-bold tracking-normal text-ink ${dimensions.title}`}>Apple MDM Academy</span>
          <span className={`block truncate text-ink-tertiary ${dimensions.subtitle}`}>Apple · Jamf · Intune</span>
        </span>
      )}
    </Link>
  );
}
