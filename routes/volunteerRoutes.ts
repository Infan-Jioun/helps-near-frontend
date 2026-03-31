import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const volunteerRoutes: Route[] = [
    {
        title: "Volunteer Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/create-emergency",
            },
            {
                title: "My Profile",
                url: "/myprofile",
            },
            {
                title: "My Emergencies",
                url: "/my-emergencies"
            },
            {
                title: "Payment Management",
                url: "/payment-management",
            },

        ],
    },
];
