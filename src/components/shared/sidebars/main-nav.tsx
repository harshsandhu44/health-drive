"use client";

import { CreateAppointmentModal } from "@/components/appointments/create-appointment-modal";
import { buttonVariants } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface MainNavProps {
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    disabled?: boolean;
  }[];
}

export const MainNav = ({ items }: MainNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-6">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <CreateAppointmentModal
              triggerButton={
                <SidebarMenuButton
                  tooltip="Create Appointment"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "justify-start"
                  )}
                >
                  <PlusCircleIcon />
                  <span>Create Appointment</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                tooltip={item.label}
                disabled={item.disabled}
                className={cn(
                  buttonVariants({
                    variant: pathname === item.href ? "outline" : "ghost",
                    size: "sm",
                  }),
                  "justify-start"
                )}
                onClick={() => router.push(item.href)}
              >
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
