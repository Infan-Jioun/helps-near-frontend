/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MapPin, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { emergencyApi } from "@/lib/emergencyApi";

type Emergency = {
    id: string;
    type: string;
    description?: string;
    latitude: number;
    longitude: number;
    address?: string;
    district?: string;
    isPriority: boolean;
    createdAt: string;
    user?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    responses?: {
        id: string;
        message?: string;
        createdAt: string;
    }[];
};

export default function MyEmargency() {
    const { id } = useParams();
    const [data, setData] = useState<Emergency | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await emergencyApi.getById(id as string);
                setData(res.data || res);
            } catch (err: any) {
                toast.error(err.message || "Failed to load emergency");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
            </div>
        );
    }


    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Emergency not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                    <h1 className="text-lg font-semibold text-slate-800">
                        Emergency Details
                    </h1>

                    {data.isPriority && (
                        <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                            Priority
                        </span>
                    )}
                </div>

                {/* Main Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">

                    {/* Type */}
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-slate-700">
                            {data.type}
                        </span>
                    </div>

                    {/* Description */}
                    {data.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {data.description}
                        </p>
                    )}

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                        <div>
                            <p>
                                {data.address || "No address provided"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {data.district} | {data.latitude}, {data.longitude}
                            </p>
                        </div>
                    </div>

                    {/* User Info */}
                    {data.user && (
                        <div className="border-t pt-4">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                                Reported By
                            </h3>
                            <div className="text-sm text-slate-600 space-y-1">
                                <p>{data.user.name || "N/A"}</p>
                                <p>{data.user.email || "N/A"}</p>
                                <p>{data.user.phone || "N/A"}</p>
                            </div>
                        </div>
                    )}

                    {/* Responses */}
                    <div className="border-t pt-4">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">
                            Responses
                        </h3>

                        {data.responses && data.responses.length > 0 ? (
                            <div className="space-y-3">
                                {data.responses.map((res) => (
                                    <div
                                        key={res.id}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                                    >
                                        <p className="text-sm text-slate-700">
                                            {res.message || "No message"}
                                        </p>
                                        <span className="text-xs text-slate-400">
                                            {new Date(res.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">
                                No responses yet
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}