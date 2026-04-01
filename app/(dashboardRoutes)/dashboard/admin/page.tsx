import React from "react";
import Link from "next/link";
import {
  Users, AlertCircle, FileText, Heart, CreditCard, ShieldAlert, TrendingUp
} from "lucide-react";

const stats = [
  { label: "Total users", value: "1,284", sub: "+12 this week", positive: true },
  { label: "Volunteers", value: "342", sub: "+5 pending", positive: true },
  { label: "Emergencies", value: "47", sub: "8 active now", positive: false },
  { label: "Payments", value: "$94k", sub: "This month", positive: true },
];

const navItems = [
  { title: "User Management", desc: "View & manage users", url: "/dashboard/admin/users-management", icon: Users },
  { title: "Create Emergency", desc: "Post a new alert", url: "/dashboard/admin/create-emergency", icon: AlertCircle },
  { title: "My Emergencies", desc: "Track your posts", url: "/dashboard/admin/my-emergencies", icon: FileText },
  { title: "Volunteer Management", desc: "Approve volunteers", url: "/dashboard/admin/volunteer-management", icon: Heart },
  { title: "Payment Management", desc: "Transactions & logs", url: "/dashboard/admin/payment-management", icon: CreditCard },
  { title: "Emergency Management", desc: "All active cases", url: "/emergency-management", icon: ShieldAlert },
];

const recentActivity = [
  { text: "New emergency posted — Flood in Sylhet", time: "2m ago", color: "#E24B4A" },
  { text: "Volunteer Rahim approved", time: "15m ago", color: "#1D9E75" },
  { text: "Payment ৳5,000 received from Karim", time: "1h ago", color: "#378ADD" },
  { text: "User Nasrin registered", time: "3h ago", color: "#888780" },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <div>
            <h1 className="text-lg font-medium">
              Helps<span className="text-red-600">Near</span> — Admin
            </h1>
            <p className="text-sm text-muted-foreground">Welcome back, Administrator</p>
          </div>
        </div>
        <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
          Admin Panel
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-medium">{s.value}</p>
            <p className={`text-xs mt-1 ${s.positive ? "text-emerald-600" : "text-red-500"}`}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Quick actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {navItems.map(({ title, desc, url, icon: Icon }) => (
            <Link
              key={url}
              href={url}
              className="group relative bg-white dark:bg-card border border-border rounded-xl p-4 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <span className="absolute top-4 right-4 text-muted-foreground text-sm">›</span>
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-red-600 transition-colors">
                <Icon size={16} className="text-red-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Recent activity
        </p>
        <div className="bg-white dark:bg-card border border-border rounded-xl divide-y divide-border">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
              <span className="text-sm flex-1">{a.text}</span>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}