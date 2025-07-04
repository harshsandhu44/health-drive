"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface OrgFooterProps {
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    disabled?: boolean;
  }[];
}

export const OrgFooter = ({ items }: OrgFooterProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-6">
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
                {item.disabled && (
                  <div className="ml-auto">
                    <Badge variant="outline">Admin Only</Badge>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SignOutButton redirectUrl="/sign-in">
              <SidebarMenuButton
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <LogOutIcon />
                <span>Log out</span>
              </SidebarMenuButton>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
