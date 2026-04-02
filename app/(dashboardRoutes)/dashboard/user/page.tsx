"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  List,
  HandHelping,
  CreditCard,
} from "lucide-react";

const dashboardItems = [
  {
    title: "Create Emergency",
    description: "Report a new emergency quickly",
    icon: AlertTriangle,
    path: "/dashboard/user/create-emergency",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "My Emergencies",
    description: "View all your reported emergencies",
    icon: List,
    path: "/dashboard/user/my-emergencies",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Volunteer Response",
    description: "Track responses from volunteers",
    icon: HandHelping,
    path: "/dashboard/user/volunteer-response",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Payment Management",
    description: "Manage your payments and history",
    icon: CreditCard,
    path: "/dashboard/user/payment-management",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function UserDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-red-500">
          User Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your emergencies and activities
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={index}
              onClick={() => router.push(item.path)}
              className="cursor-pointer border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
                >
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
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