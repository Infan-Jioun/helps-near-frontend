import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const userRoutes: Route[] = [
    {
        title: "User Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/dashboard/user/create-emergency",
            },
            {
              title : "My Emergencies",
              url : `/dashboard/user/my-emergencies`
            },
            {
                title: "Payment Management",
                url: "/dashboard/user/payment-management",
            },
           
        ],
    },
];