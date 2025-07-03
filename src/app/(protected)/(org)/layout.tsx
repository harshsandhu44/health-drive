import { OrgHeader } from "@/components/shared/headers";
import { OrgSidebar } from "@/components/shared/sidebars";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const OrgLayout = ({ children }: { children: React.ReactNode }) => {
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="container py-4 md:py-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default OrgLayout;
