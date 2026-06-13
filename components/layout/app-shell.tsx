"use client";

import { Sidebar, SidebarSpacer } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Header } from "@/components/layout/header";

type AppShellProps = {
  children: React.ReactNode;
  footer: React.ReactNode;
  authSlot: React.ReactNode;
};

export function AppShell({ children, footer, authSlot }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <SidebarSpacer />
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <Header authSlot={authSlot} />
          <main id="main-content" className="flex-1 overflow-x-hidden" tabIndex={-1}>
            {children}
          </main>
          {footer}
        </div>
      </div>
    </SidebarProvider>
  );
}
