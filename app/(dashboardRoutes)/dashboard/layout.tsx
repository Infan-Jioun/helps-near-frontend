import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
            <body>
                <TooltipProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header className="flex h-12 items-center gap-2 px-4 md:hidden border-b">
                                <SidebarTrigger />
                                <span className="font-semibold text-sm">
                                    Helps<span className="text-red-600">Near</span>
                                </span>
                            </header>
                            <main className="p-4">{children}</main>
                        </SidebarInset>
                    </SidebarProvider>
                </TooltipProvider>
            </body>
        </>
    );
}