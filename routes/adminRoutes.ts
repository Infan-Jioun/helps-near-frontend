import { Route } from "@/lib/routes";
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    ClipboardList,
    CreditCard,
    ShieldAlert,
} from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "Admin Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "User Management",
                url: "/dashboard/admin/users-management",
                icon: Users,
            },
            {
                title: "Create Emergency",
                url: "/dashboard/admin/create-emergency",
                icon: AlertTriangle,
            },
            {
                title: "My Emergencies",
                url: "/dashboard/admin/my-emergencies",
                icon: ClipboardList,
            },
            {
                title: "Payment Management",
                url: "/dashboard/admin/payment-management",
                icon: CreditCard,
            },
            {
                title: "Emergency Management",
                url: "/emergency-management",
                icon: ShieldAlert,
            },
        ],
    },
];