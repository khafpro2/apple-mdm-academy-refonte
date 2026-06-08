"use client";

import { useState, FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/layout/sidebar-context";

type HeaderProps = {
  authSlot: ReactNode;
};

export function Header({ authSlot }: HeaderProps) {
  const { toggleMobile, mobileOpen } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/parcours?q=${encodeURIComponent(q)}`);
    else router.push("/parcours");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border-light bg-surface/90 px-4 backdrop-blur-xl lg:px-6">
      <button
        type="button"
        onClick={toggleMobile}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border-light p-2 text-ink-secondary hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
        aria-label="Ouvrir le menu de navigation"
        aria-expanded={mobileOpen}
        aria-controls="sidebar-nav"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <form onSubmit={onSearch} className="hidden min-w-0 flex-1 sm:block sm:max-w-md" role="search">
        <label htmlFor="header-search" className="sr-only">
          Rechercher un parcours
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
          <input
            id="header-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un parcours…"
            className="w-full rounded-lg border border-border-light bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">{authSlot}</div>
    </header>
  );
}
