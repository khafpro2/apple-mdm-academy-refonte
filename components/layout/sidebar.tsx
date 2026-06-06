"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogoIcon } from "@/components/ui/logo-icon";
import { useSidebar } from "@/components/layout/sidebar-context";
import {
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
            onClick={() => setUserOpen(!(open))}
            className="mr-1 rounded p-1 text-ink-tertiary hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
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
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();

  const onNavigate = useCallback(() => {
    closeMobile();
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

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN;

  const aside = (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-light bg-surface-elevated transition-[width,transform] duration-200 ease-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
      style={{ width: mobileOpen ? SIDEBAR_WIDTH_OPEN : width }}
      id="sidebar-nav"
      aria-label="Navigation principale"
    >
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border-light px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Apple MDM Academy — Accueil"
        >
          <LogoIcon name="apple" size={24} alt="Apple MDM Academy" />
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-ink">Apple MDM Academy</span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden rounded-lg border border-border-light p-1.5 text-ink-secondary hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent lg:inline-flex"
          aria-label={collapsed ? "Ouvrir la sidebar" : "Réduire la sidebar"}
          aria-expanded={!collapsed}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            {collapsed ? (
              <path strokeWidth="2" strokeLinecap="round" d="M9 6l6 6-6 6" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" d="M15 6l-6 6 6 6" />
            )}
          </svg>
        </button>
        <button
          type="button"
          onClick={closeMobile}
          className="rounded-lg p-1.5 text-ink-secondary hover:bg-surface lg:hidden"
          aria-label="Fermer le menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1" role="list">
          {sidebarMainNav.map((item) => (
            <NavLink key={item.href + item.label} item={item} collapsed={collapsed && !mobileOpen} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="border-t border-border-light px-4 py-3 text-xs text-ink-tertiary">
          Formation Apple · Jamf · Intune
        </div>
      )}
    </aside>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label="Fermer le menu"
          onClick={closeMobile}
        />
      )}
      {aside}
    </>
  );
}

export function SidebarSpacer() {
  const { collapsed } = useSidebar();
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN;
  return (
    <div
      className="hidden shrink-0 transition-[width] duration-200 ease-out lg:block"
      style={{ width }}
      aria-hidden="true"
    />
  );
}
