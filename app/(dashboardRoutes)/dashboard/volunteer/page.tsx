"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Activity,
  User,
  List,
  CreditCard,
} from "lucide-react";

const dashboardItems = [
  {
    title: "Create Emergency",
    description: "Report a new emergency instantly",
    icon: AlertTriangle,
    path: "/dashboard/volunteer/create-emergency",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Emergency Responses",
    description: "View and manage assigned emergencies",
    icon: Activity,
    path: "/dashboard/volunteer/emergency-responses",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "My Profile",
    description: "Update your personal information",
    icon: User,
    path: "/dashboard/volunteer/myprofile",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "My Emergencies",
    description: "Track emergencies you responded to",
    icon: List,
    path: "/dashboard/volunteer/my-emergencies",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Payment Management",
    description: "Handle payments and earnings",
    icon: CreditCard,
    path: "/dashboard/volunteer/payment-management",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function VolunteerDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Volunteer Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Manage emergencies, responses, and your activity
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={index}
              onClick={() => router.push(item.path)}
              className="cursor-pointer border hover:shadow-md transition-all duration-200 hover:-translate-y-1 group"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
                >
                  <Icon
                    className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`}
                  />
                </div>

                {/* Text */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}