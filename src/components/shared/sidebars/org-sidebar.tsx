"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Building2Icon,
  CalendarIcon,
  LayoutDashboardIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { MainNav } from "./main-nav";

const mainNav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: CalendarIcon,
  },
  {
    label: "Departments",
    href: "/departments",
    icon: Building2Icon,
  },
  {
    label: "Doctors",
    href: "/doctors",
    icon: User2Icon,
  },
  {
    label: "Staff",
    href: "/staff",
    icon: Users2Icon,
  },
];

export const OrgSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <Link href="/dashboard">Health Drive</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <MainNav items={mainNav} />
      </SidebarContent>
    </Sidebar>
  );
};
