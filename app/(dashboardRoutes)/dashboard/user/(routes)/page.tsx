import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "User Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/create-emergency",
            },
            {
              title : "My Emergencies",
              url : "/my-emergencies"
            },
            {
                title: "Payment Management",
                url: "/payment-management",
            },
           
        ],
    },
];