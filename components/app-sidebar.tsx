/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { adminRoutes } from "@/app/(dashboardRoutes)/dashboard/admin/(routes)/page";
import { volunteerRoutes } from "@/app/(dashboardRoutes)/dashboard/volunteer/(routes)/page";
import { userRoutes } from "@/app/(dashboardRoutes)/dashboard/user/(routes)/page";
import Logo from "./logo/logo";


const navSecondary: { title: string; url: string; icon: React.ReactNode }[] = [
  { title: "Settings", url: "/settings", icon: <Settings2Icon /> },
  { title: "Get Help", url: "/help", icon: <CircleHelpIcon /> },
  { title: "Search", url: "/search", icon: <SearchIcon /> },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;

  const navMain = React.useMemo(() => {
    if (role === "ADMIN") return adminRoutes;
    if (role === "VOLUNTEER") return volunteerRoutes;
    return userRoutes;
  }, [role]);

  const user = session?.user
    ? {
      name: session.user.name || "User",
      email: session.user.email || "",
      avatar: (session.user as any)?.image || "",
    }
    : { name: "Guest", email: "", avatar: "" };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-5 h-7 mt-5 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <Logo />
                </div>
                <span className="text-base font-semibold">
                  Helps<span className="text-red-600">Near</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isPending ? (
          <div className="px-4 py-6 flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <NavMain items={navMain} />
        )}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}