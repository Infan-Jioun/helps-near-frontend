/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { axiosInstance } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Shield,
    AlertTriangle,
    Heart,
    Clock,
    CheckCircle,

} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    VOLUNTEER: "bg-green-100 text-green-700 border-green-200",
    USER: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        bloodGroup: "",
    });

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/api/v1/users/me");
            setProfile(res.data?.data);
            setForm({
                name: res.data?.data?.name || "",
                phone: res.data?.data?.phone || "",
                bloodGroup: res.data?.data?.bloodGroup || "",
            });
        } catch {
            setError("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };


    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 space-y-6">

                    {/* Header Skeleton */}
                    <div className="bg-white rounded-3xl p-6">
                        <div className="flex items-center gap-4">
                            <Skeleton height={80} width={80} borderRadius={16} />
                            <div className="flex-1">
                                <Skeleton height={20} width={200} />
                                <Skeleton height={15} width={250} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Skeleton */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 space-y-4">
                            <Skeleton height={20} width={180} />
                            <Skeleton height={40} />
                            <Skeleton height={40} />
                            <Skeleton height={40} />
                        </div>

                        {/* Right Skeleton */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-6 space-y-3">
                                <Skeleton height={20} width={150} />
                                <Skeleton height={20} />
                                <Skeleton height={20} />
                                <Skeleton height={20} />
                            </div>

                            <div className="bg-white rounded-2xl p-6">
                                <Skeleton height={20} width={120} />
                                <Skeleton height={20} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Please login to view your profile.</p>
            </div>
        );
    }

    const user = profile || session.user;
    const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <div className="h-28 bg-gradient-to-r from-red-600 to-red-500 relative">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-2 right-10 w-24 h-24 bg-white rounded-full" />
                            <div className="absolute -bottom-4 left-20 w-16 h-16 bg-white rounded-full" />
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 bg-red-100 border-4 border-white rounded-2xl flex items-center justify-center text-3xl font-bold text-red-600 shadow-md">
                                    {initials || <User className="w-10 h-10" />}
                                </div>

                            </div>


                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-400 text-sm">{user?.email}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:ml-4">
                                <Badge className={`${roleColors[user?.role] || roleColors.USER} border text-xs`}>
                                    {user?.role}
                                </Badge>
                                {user?.emailVerified && (
                                    <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </Badge>
                                )}
                                {user?.isVolunteer && (
                                    <Badge className="bg-red-50 text-red-700 border-red-200 border text-xs gap-1">
                                        <Heart className="w-3 h-3" />
                                        Volunteer
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Personal Info */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-red-600" />
                            </div>
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-gray-400 uppercase tracking-wide">Full Name</Label>
                                {editing ? (
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                                        <User className="w-4 h-4 text-gray-400" />
                                        {user?.name || "—"}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-gray-400 uppercase tracking-wide">Email</Label>
                                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl text-sm text-gray-500">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {user?.email || "—"}
                                </div>
                            </div>




                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-red-600" />
                                </div>
                                Account Status
                            </h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Role</span>
                                    <Badge className={`${roleColors[user?.role] || roleColors.USER} border text-xs`}>
                                        {user?.role}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Email</span>
                                    <Badge className={user?.emailVerified ? "bg-green-50 text-green-700 border-green-200 border text-xs" : "bg-yellow-50 text-yellow-700 border-yellow-200 border text-xs"}>
                                        {user?.emailVerified ? "Verified" : "Unverified"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <Badge className={user?.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200 border text-xs" : "bg-red-50 text-red-700 border-red-200 border text-xs"}>
                                        {user?.status || "ACTIVE"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Volunteer</span>
                                    <Badge className={user?.isVolunteer ? "bg-red-50 text-red-700 border-red-200 border text-xs" : "bg-gray-50 text-gray-500 border text-xs"}>
                                        {user?.isVolunteer ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-red-600" />
                                </div>
                                Member Since
                            </h2>
                            <p className="text-sm text-gray-500">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "—"}
                            </p>
                        </div>

                        {!user?.isVolunteer && (
                            <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-red-700">Become a Volunteer</h3>
                                </div>
                                <p className="text-sm text-red-600/80 mb-4">
                                    Help your community by becoming a verified volunteer.
                                </p>
                                <Button
                                    size="sm"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                    asChild
                                >
                                    <a href="/volunteer/register">Join Now</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}