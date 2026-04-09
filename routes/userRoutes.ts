import { Route } from "@/lib/routes";
import {
    LayoutDashboard,
    AlertTriangle,
    ClipboardList,
    HandHelping,
    CreditCard,
} from "lucide-react";

export const userRoutes: Route[] = [
    {
        title: "User Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/dashboard/user/create-emergency",
                icon: AlertTriangle,
            },
            {
                title: "My Emergencies",
                url: "/dashboard/user/my-emergencies",
                icon: ClipboardList,
            },
            {
                title: "Volunteer Response",
                url: "/dashboard/user/volunteer-response",
                icon: HandHelping,
            },
            {
                title: "Payment Management",
                url: "/dashboard/user/payment-management",
                icon: CreditCard,
            },
        ],
    },
];