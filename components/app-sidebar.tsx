"use client";

import * as React from "react";
import Link from "next/link";

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

import { Settings2Icon, CircleHelpIcon, SearchIcon } from "lucide-react";

import { axiosInstance } from "@/lib/axiosInstance";
import Logo from "./logo/logo";
import { adminRoutes } from "@/app/(dashboardRoutes)/dashboard/admin/(routes)/page";
import { volunteerRoutes } from "@/app/(dashboardRoutes)/dashboard/volunteer/(routes)/page";
import { userRoutes } from "@/app/(dashboardRoutes)/dashboard/user/(routes)/page";


type Role = "ADMIN" | "VOLUNTEER" | "USER";

// ✅ API: res.data.data = { id, name, email, role, ... } — কোনো nested "user" object নেই
interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  role?: Role;
  status?: string;
  isVolunteer?: boolean;
}

interface NavUserShape {
  name: string;
  email: string;
  avatar: string;
}


const NAV_SECONDARY_ITEMS = [
  { title: "Settings", url: "/settings", icon: <Settings2Icon /> },
  { title: "Help", url: "/help", icon: <CircleHelpIcon /> },
  { title: "Search", url: "/search", icon: <SearchIcon /> },
];

const GUEST_USER: NavUserShape = { name: "Guest", email: "", avatar: "" };

function getNavRoutes(role?: Role) {
  switch (role) {
    case "ADMIN": return adminRoutes;
    case "VOLUNTEER": return volunteerRoutes;
    default: return userRoutes;
  }
}

function buildNavUser(user?: SessionUser): NavUserShape {
  if (!user) return GUEST_USER;
  return {
    name: user.name || "User",
    email: user.email || "",
    avatar: user.profileImage || "",
  };
}


function NavSkeleton() {
  return (
    <div className="px-4 py-6 flex flex-col gap-2" aria-busy="true" aria-label="Loading navigation">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-8 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
}



function useSession() {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/auth/me");
        const userData: SessionUser = res.data?.data ?? null;

        if (!cancelled) setUser(userData);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSession();
    return () => { cancelled = true; };
  }, []);

  return { user, loading };
}


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useSession();

  const navMain = React.useMemo(() => getNavRoutes(user?.role), [user?.role]);
  const navUser = React.useMemo(() => buildNavUser(user ?? undefined), [user]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <Logo />
                </div>
                <span className="font-semibold">
                  Helps<span className="text-red-600">Near</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {loading ? <NavSkeleton /> : <NavMain items={navMain} />}

        <NavSecondary
          items={NAV_SECONDARY_ITEMS}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>

    </Sidebar>
  );
}