import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <TooltipProvider>
                    <SidebarProvider>
                        <AppSidebar />

                        <SidebarInset>
                            <main className="p-4">{children}</main>
                        </SidebarInset>
                    </SidebarProvider>
                </TooltipProvider>
            </body>
        </html>
    );
}