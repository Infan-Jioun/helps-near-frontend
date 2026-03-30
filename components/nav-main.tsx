"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Route } from "@/lib/routes"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: Route[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items?.map((group) => (
            <div key={group.title}>

              {/* Parent */}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={group.title}>
                  {group.icon && <group.icon />}
                  <span>{group.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Children */}
              {group.items?.map((sub) => (
                <SidebarMenuItem key={sub.title} className="ml-6">
                  <SidebarMenuButton asChild>
                    <Link href={sub.url} className="hover:bg-red-500">
                      <span>{sub.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </div>
          ))}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}