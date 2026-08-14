"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AcademyLogo } from "@/components/layout/academy-logo";

const NAV_LINKS = [
  { href: "#apple", label: "Apple" },
  { href: "#jamf", label: "Jamf" },
  { href: "#intune", label: "Intune" },
  { href: "/parcours", label: "Parcours" },
  { href: "/certifications", label: "Certifications" },
  { href: "/quiz", label: "Quiz" },
  { href: "/pricing", label: "Tarifs" },
];

type Props = { authSlot: ReactNode };

/** Header épuré dédié à la landing page — pas de sidebar applicative (Dashboard, etc.) pour un visiteur anonyme. */
export function MarketingHeader({ authSlot }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-border-light backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-surface/95 shadow-sm" : "bg-surface/90"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center gap-6 px-6 transition-all duration-300 lg:px-8 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <AcademyLogo size="sm" />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">{authSlot}</div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border-light p-2 text-ink-secondary hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          aria-controls="marketing-mobile-nav"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div id="marketing-mobile-nav" className="border-t border-border-light bg-surface px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-elevated hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-3 border-t border-border-light pt-3">{authSlot}</div>
        </div>
      )}
    </header>
  );
}
