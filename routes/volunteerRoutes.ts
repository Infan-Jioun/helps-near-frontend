import { Route } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

export const volunteerRoutes: Route[] = [
    {
        title: "Volunteer Dashboard",
        icon: LayoutDashboard,
        items: [
            {
                title: "Create Emergency",
                url: "/dashboard/volunteer/create-emergency",
            },
              {
                  title: "Emergency Responses",
                    url: "/dashboard/volunteer/emergency-responses",
              },
            {
                title: "My Profile",
                url: "/dashboard/volunteer/myprofile",
            },
            {
                title: "My Emergencies",
                url: "/dashboard/volunteer/my-emergencies"
            },
            {
                title: "Payment Management",
                url: "/dashboard/volunteer/payment-management",
            },

        ],
    },
];
