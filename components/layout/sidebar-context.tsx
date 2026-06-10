"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SIDEBAR_STORAGE_KEY } from "@/lib/navigation/sidebar-config";

const COLLAPSE_EVENT = "apple-mdm-sidebar-change";

function getCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribeCollapsed(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COLLAPSE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(COLLAPSE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // useState+useEffect évite le hydration mismatch (SSR=false vs client=localStorage)
  const [collapsed, setCollapsedState] = useState(false);
  useEffect(() => {
    setCollapsedState(getCollapsedSnapshot());
    const handler = () => setCollapsedState(getCollapsedSnapshot());
    window.addEventListener(COLLAPSE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(COLLAPSE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = useCallback((value: boolean) => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
      window.dispatchEvent(new Event(COLLAPSE_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!getCollapsedSnapshot());
  }, [setCollapsed]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      toggleMobile,
      closeMobile,
    }),
    [collapsed, closeMobile, mobileOpen, setCollapsed, toggleCollapsed, toggleMobile]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
