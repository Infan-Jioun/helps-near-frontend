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
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavMain({ items }: { items: Route[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent className="flex flex-col gap-4">
        <SidebarMenu>
          {items?.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">

              {/* Parent Header */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={group.title}
                  className={cn(
                    "relative overflow-hidden group/header",
                    "bg-gradient-to-r from-red-700 via-red-600 to-red-500",
                    "text-white font-bold tracking-widest uppercase text-[10px]",
                    "px-3 py-2.5 rounded-none",
                    "[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]",
                    "hover:from-red-600 hover:via-red-500 hover:to-red-400 transition-all duration-300",
                    "shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                  )}
                >
                  {/* Scanline overlay */}
                  <span
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)",
                    }}
                  />
                  {group.icon && (
                    <group.icon className="size-3.5 shrink-0 text-red-100 drop-shadow" />
                  )}
                  <span className="relative z-10">{group.title}</span>
                  <span className="ml-auto relative z-10 flex size-1.5 rounded-full bg-red-200 shadow-[0_0_6px_2px_rgba(255,100,100,0.8)] animate-pulse" />
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Children */}
              <div className="flex flex-col gap-px pl-0 relative">
                {/* Vertical track line */}
                <span className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-red-500/60 via-red-400/30 to-transparent" />

                {group.items?.map((sub) => {
                  const isActive = pathname === sub.url
                  const Icon = sub.icon

                  return (
                    <SidebarMenuItem key={sub.title}>
                      <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                        <Link
                          href={sub.url}
                          className={cn(
                            "relative flex items-center gap-2.5 pl-[34px] pr-3 py-2 text-[11px] font-medium transition-all duration-200 group/item",
                            isActive
                              ? [
                                "text-white",
                                "bg-red-500",
                                "[clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]",
                              ]
                              : [
                                "text-zinc-500",
                                "hover:bg-red-500 hover:text-white",
                                "[clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]",
                              ]
                          )}
                        >
                          {/* Node dot on the track */}
                          <span
                            className={cn(
                              "absolute left-[14px] size-2 rounded-full border transition-all duration-200 z-10",
                              isActive
                                ? "bg-white border-red-300 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"
                                : "bg-zinc-700 border-zinc-600 group-hover/item:bg-white group-hover/item:border-red-300"
                            )}
                          />

                          {/* Left active bar */}
                          {isActive && (
                            <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                          )}

                          {Icon && (
                            <Icon
                              className={cn(
                                "size-3.5 shrink-0 transition-colors duration-200",
                                isActive
                                  ? "text-white"
                                  : "text-zinc-600 group-hover/item:text-white"
                              )}
                            />
                          )}

                          <span className="tracking-wide transition-colors">
                            {sub.title}
                          </span>

                          {/* Active right tick */}
                          {isActive && (
                            <span className="ml-auto text-white text-[8px] font-black tracking-widest">▶</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </div>

            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}