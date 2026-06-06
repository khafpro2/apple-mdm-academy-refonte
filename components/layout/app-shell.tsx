"use client";

import { Sidebar, SidebarSpacer } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Header } from "@/components/layout/header";

type AppShellProps = {
  children: React.ReactNode;
  footer: React.ReactNode;
  banners?: React.ReactNode;
  authSlot: React.ReactNode;
};

export function AppShell({ children, footer, banners, authSlot }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <SidebarSpacer />
        <div className="flex min-w-0 flex-1 flex-col">
          {banners}
          <Header authSlot={authSlot} />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          {footer}
        </div>
      </div>
    </SidebarProvider>
  );
}
