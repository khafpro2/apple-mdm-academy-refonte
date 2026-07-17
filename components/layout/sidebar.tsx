"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoIcon } from "@/components/ui/logo-icon";
import { AcademyLogo } from "@/components/layout/academy-logo";
import { useSidebar } from "@/components/layout/sidebar-context";
import {
  SIDEBAR_STORAGE_KEY,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_OPEN,
  sidebarMainNav,
  type SidebarNavItem,
} from "@/lib/navigation/sidebar-config";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  collapsed,
  onNavigate,
  depth = 0,
}: {
  item: SidebarNavItem;
  collapsed: boolean;
  onNavigate: () => void;
  depth?: number;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((c) => isActive(pathname, c.href)) ?? false;
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const open = userOpen ?? childActive;

  const linkClass = [
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    active || (hasChildren && childActive && depth === 0)
      ? "bg-accent/10 text-accent"
      : "text-ink-secondary hover:bg-surface hover:text-ink",
    depth > 0 ? "py-1.5 text-[13px]" : "",
  ].join(" ");

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`${linkClass} min-w-0 flex-1`}
          aria-current={active ? "page" : undefined}
          title={collapsed ? item.label : undefined}
        >
          <LogoIcon
            name={item.icon}
            size={20}
            className={active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
        {hasChildren && !collapsed && (
          <button
            type="button"
            onClick={() => setUserOpen(!open)}
            className="mr-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-ink-tertiary hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-expanded={open}
            aria-label={open ? `Replier ${item.label}` : `Déplier ${item.label}`}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 5l6 5-6 5V5z" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && open && !collapsed && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l border-border-light pl-3" role="group">
          {item.children!.map((child) => (
            <NavLink
              key={child.href}
              item={child}
              collapsed={collapsed}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();

  // ── Desktop hover ──────────────────────────────────────────────────────
  // Sur desktop (≥1024px) : la sidebar est TOUJOURS collapsed (76px).
  // Elle s'étend au hover (280px) et se referme à la sortie du curseur.
  // Le localStorage sidebar est réinitialisé au montage pour éviter
  // qu'un état "collapsed=false" persisté ne force la sidebar expanded.
  const [hovered, setHovered] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Réinitialiser le localStorage au montage pour forcer le mode hover
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, "true"); // collapsed=true = état par défaut
    } catch {
      /* ignore */
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setHovered(false), 120);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const onNavigate = useCallback(() => {
    closeMobile();
    setHovered(false);
  }, [closeMobile]);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, closeMobile]);

  // Mobile : expanded si mobileOpen
  // Desktop : expanded seulement si hovered
  const isExpanded = mobileOpen || hovered;
  const collapsed = !isExpanded;
  const desktopWidth = hovered ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <>
      {/* Overlay tactile mobile */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label="Fermer le menu"
          onClick={closeMobile}
        />
      )}

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: mobileOpen ? SIDEBAR_WIDTH_OPEN : desktopWidth,
          transitionDuration: "250ms",
        }}
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r border-border-light bg-surface-elevated shadow-sm",
          "overflow-hidden",
          "transition-[width,transform] ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        id="sidebar-nav"
        aria-label="Navigation principale"
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border-light px-4">
          <AcademyLogo
            variant={isExpanded ? "full" : "mark"}
            size="sm"
            onClick={onNavigate}
            className="flex-1"
          />

          {mobileOpen && (
            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-1.5 text-ink-secondary hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
              aria-label="Fermer le menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu principal">
          <ul className="space-y-1" role="list">
            {sidebarMainNav.map((item) => (
              <NavLink
                key={item.href + item.label}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>

        {/* ── Mention footer — visible seulement quand expanded ─────────── */}
        <div
          className={[
            "border-t border-border-light px-4 py-3 text-xs text-ink-tertiary",
            "transition-opacity duration-250 ease-out",
            isExpanded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden={!isExpanded}
        >
          Formation Apple · Jamf · Intune
        </div>
      </aside>
    </>
  );
}

export function SidebarSpacer() {
  // Sur desktop : spacer fixe à la largeur collapsed.
  // La sidebar expanded est un flyout overlay — le contenu ne se décale pas.
  return (
    <div
      className="hidden shrink-0 lg:block"
      style={{ width: SIDEBAR_WIDTH_COLLAPSED }}
      aria-hidden="true"
    />
  );
}
