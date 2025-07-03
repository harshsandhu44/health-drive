"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UserButton, useUser } from "@clerk/nextjs";

export const OrgHeader = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();
  const org = user?.organizationMemberships[0];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm font-bold line-clamp-1">
          {org?.organization.name}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <UserButton showName={!isMobile} />
        </div>
      </div>
    </header>
  );
};
