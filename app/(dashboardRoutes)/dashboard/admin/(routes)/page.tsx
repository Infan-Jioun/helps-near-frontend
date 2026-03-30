import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "Admin Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "User Management",
                url: "/users-management",
            },
            {
              title : "Volunteer Management",
              url : "/volunteer-management"
            },
            {
                title: "Payment Management",
                url: "/payment-management",
            },
            {
                title: "Emergency Management",
                url: "/emergency-management",
            },
           
        ],
    },
];