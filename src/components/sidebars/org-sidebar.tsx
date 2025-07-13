"use client";

import * as React from "react";

import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  PlusCircleIcon,
  User,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { CreateAppointmentModal } from "@/components/modals/CreateAppointmentModal";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function OrgSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Doctors", href: "/doctors", icon: Users },
    { name: "Patients", href: "/patients", icon: User },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <ClerkLoading>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="mt-auto h-8 w-full" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <OrganizationSwitcher
                  hidePersonal
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      organizationSwitcherTrigger: "w-full justify-start",
                    },
                  }}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </ClerkLoaded>

      <ClerkLoaded>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4">
              <SidebarMenu>
                <SidebarMenuItem className="flex items-center gap-2">
                  <CreateAppointmentModal>
                    <SidebarMenuButton
                      tooltip="Create Appointment"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full justify-start"
                      )}
                    >
                      <PlusCircleIcon />
                      <span>Create Appointment</span>
                    </SidebarMenuButton>
                  </CreateAppointmentModal>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu>
                {navigation.map(item => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      tooltip={item.name}
                      className={cn(
                        buttonVariants({
                          variant: pathname === item.href ? "outline" : "ghost",
                          size: "sm",
                        }),
                        "w-full justify-start"
                      )}
                      onClick={() => router.push(item.href)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </ClerkLoaded>

      <ClerkLoaded>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuAction asChild>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      userButtonTrigger: "w-full justify-start",
                      userButtonBox: "flex-row-reverse",
                    },
                  }}
                />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </ClerkLoaded>
    </Sidebar>
  );
}
