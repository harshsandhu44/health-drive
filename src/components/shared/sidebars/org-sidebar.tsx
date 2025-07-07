"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { MainNav } from "./main-nav";
import { OrgNav } from "./org-nav";
import { useUser } from "@clerk/nextjs";
import { OrgFooter } from "./org-footer";

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
    label: "Doctors",
    href: "/doctors",
    icon: User2Icon,
  },
];

export const OrgSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { user } = useUser();
  const isOrgAdmin = user?.organizationMemberships[0].role === "org:admin";
  const orgMetadata =
    user?.organizationMemberships[0].organization.publicMetadata;
  const isOrgPro =
    orgMetadata?.plan === "pro" || orgMetadata?.plan === "business";

  const orgNav = [
    {
      label: "Departments",
      href: "/departments",
      icon: Building2Icon,
      disabled: !isOrgPro,
    },
    {
      label: "Staff",
      href: "/staff",
      icon: Users2Icon,
      disabled: !isOrgPro,
    },
  ];

  const footerNav = [
    {
      label: "Help",
      href: "/help",
      icon: HelpCircleIcon,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: CreditCardIcon,
      disabled: !isOrgAdmin,
    },
  ];

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
        {isOrgAdmin && <OrgNav items={orgNav} />}
      </SidebarContent>

      <SidebarFooter>
        <OrgFooter items={footerNav} />
      </SidebarFooter>
    </Sidebar>
  );
};
