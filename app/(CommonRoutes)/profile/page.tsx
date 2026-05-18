/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User, Mail, Shield, Heart, CheckCircle, AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    VOLUNTEER: "bg-green-100 text-green-700 border-green-200",
    USER: "bg-blue-100 text-blue-700 border-blue-200",
};

// ─── Custom Skeleton ────────────────────────────────────────────────
function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}
        >
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.07) 40%, rgba(220,38,38,0.13) 50%, rgba(220,38,38,0.07) 60%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.8s ease-in-out infinite",
                }}
            />
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Header card skeleton */}
                    <div className="bg-white rounded-3xl shadow-sm mb-6 overflow-hidden">
                        {/* Banner */}
                        <div className="h-28 relative overflow-hidden"
                            style={{ background: "#fca5a5" }}>
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.8s ease-in-out infinite",
                                }}
                            />
                        </div>

                        <div className="p-6 -mt-12">
                            {/* Avatar */}
                            <Shimmer className="w-24 h-24 rounded-2xl border-4 border-white shadow" />

                            {/* Name + email */}
                            <div className="mt-4 space-y-2">
                                <Shimmer className="h-7 w-48" />
                                <Shimmer className="h-4 w-36" />
                            </div>

                            {/* Badges */}
                            <div className="flex gap-2 mt-3">
                                <Shimmer className="h-6 w-20 rounded-full" />
                                <Shimmer className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Info grid skeleton */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[0, 1].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                                {/* Section title */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Shimmer className="w-4 h-4 rounded" />
                                    <Shimmer className="h-5 w-28" />
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Shimmer className="w-4 h-4 flex-shrink-0 rounded" />
                                            <Shimmer className={`h-4 ${j === 1 ? "w-40" : j === 2 ? "w-52" : "w-32"}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA skeleton */}
                    <div className="mt-6 bg-red-50 p-6 rounded-2xl">
                        <Shimmer className="h-5 w-44 mb-3" />
                        <Shimmer className="h-4 w-72 mb-4" />
                        <Shimmer className="h-10 w-28 rounded-lg" />
                    </div>
                </div>
            </div>
        </>
    )
}

// ─── Main Component ─────────────────────────────────────────────────
export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/api/v1/auth/me");
                setUser(res.data?.data);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <ProfileSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {error}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                No user found
            </div>
        );
    }

    const initials = user?.name
        ?.split(" ")
        ?.map((n: string) => n[0])
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase();

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">

                    {/* HEADER */}
                    <div className="bg-white rounded-3xl shadow-sm mb-6 overflow-hidden">
                        <div className="h-28 bg-red-600" />

                        <div className="p-6 -mt-12">
                            <div className="w-24 h-24 bg-red-100 border-4 border-white rounded-2xl flex items-center justify-center text-3xl font-bold text-red-600 shadow">
                                {initials || <User />}
                            </div>

                            <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
                            <p className="text-gray-400 text-sm">{user.email}</p>

                            <div className="flex gap-2 mt-3 flex-wrap">
                                <Badge className={roleColors[user.role]}>
                                    {user.role}
                                </Badge>
                                {user.emailVerified && (
                                    <Badge className="bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                                {user.isVolunteer && (
                                    <Badge className="bg-red-100 text-red-700">
                                        <Heart className="w-3 h-3 mr-1" />
                                        Volunteer
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Personal Info
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-2 items-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                    {user.name}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Status
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Account</span>
                                    <span>{user.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Volunteer</span>
                                    <span>{user.isVolunteer ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Joined</span>
                                    <span>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!user.isVolunteer && (
                        <div className="mt-6 bg-red-50 p-6 rounded-2xl">
                            <h3 className="font-semibold text-red-600 mb-2">
                                Become a Volunteer
                            </h3>
                            <Button className="bg-red-600 text-white mt-2" asChild>
                                <Link href="/volunteer-register">Join Now</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}