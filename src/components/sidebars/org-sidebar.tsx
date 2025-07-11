"use client";

import * as React from "react";

import { OrganizationSwitcher } from "@clerk/nextjs";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  PlusCircleIcon,
  Settings,
  User,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function OrgSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Doctors", href: "/doctors", icon: Users },
    { name: "Patients", href: "/patients", icon: User },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <OrganizationSwitcher hidePersonal />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-4">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full justify-start"
                  )}
                >
                  <PlusCircleIcon />
                  <span>Create Appointment</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              {navigation.map(item => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
