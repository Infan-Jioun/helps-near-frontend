import { Route } from "@/lib/routes";
import {
    LayoutDashboard,
    AlertTriangle,
    ShieldCheck,
    UserCircle,
    ClipboardList,
    CreditCard,
} from "lucide-react";

export const volunteerRoutes: Route[] = [
    {
        title: "Volunteer Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/dashboard/volunteer/create-emergency",
                icon: AlertTriangle,
            },
            {
                title: "Emergency Responses",
                url: "/dashboard/volunteer/emergency-responses",
                icon: ShieldCheck,
            },
            {
                title: "My Profile",
                url: "/dashboard/volunteer/myprofile",
                icon: UserCircle,
            },
            {
                title: "My Emergencies",
                url: "/dashboard/volunteer/my-emergencies",
                icon: ClipboardList,
            },
            {
                title: "Payment Management",
                url: "/dashboard/volunteer/payment-management",
                icon: CreditCard,
            },
        ],
    },
];