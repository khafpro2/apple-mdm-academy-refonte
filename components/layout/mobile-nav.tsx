"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/parcours", label: "Parcours" },
  { href: "/cours", label: "Cours" },
  { href: "/videos", label: "Vidéos" },
  { href: "/resources", label: "Ressources" },
  { href: "/labs", label: "Labs" },
  { href: "/quiz", label: "Quiz" },
  { href: "/examens", label: "Examens" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/enterprise", label: "Entreprise" },
  { href: "/support", label: "Aide" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-border-light p-2 text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-50 border-b border-border-light bg-surface-elevated px-6 py-4 shadow-lg"
          aria-label="Navigation mobile"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
