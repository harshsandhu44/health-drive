import { ReactNode } from "react";

import { OrgHeader } from "@/components/headers";
import { OrgSidebar } from "@/components/sidebars";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <OrgSidebar variant="inset" />
      <SidebarInset>
        <OrgHeader />
        <div className="@container/main container flex flex-1 flex-col py-4 md:py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
