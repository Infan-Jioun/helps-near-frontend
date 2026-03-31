import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "Admin Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "User Management",
                url: "/dashboard/admin/users-management",
            },
            {
                title: "Create Emergency",
                url: "/dashboard/admin/create-emergency",
            },
            {
                title: "My Emergencies",
                url: "/dashboard/admin/my-emergencies"
            },
            {
                title: "Volunteer Management",
                url: "/dashboard/admin/volunteer-management"
            },
            {
                title: "Payment Management",
                url: "/dashboard/admin/payment-management",
            },
            {
                title: "Emergency Management",
                url: "/emergency-management",
            },

        ],
    },
];
