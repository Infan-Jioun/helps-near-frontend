"use client";

import { useEffect, useState } from "react";
import { emergencyApi } from "@/lib/emergencyApi";
import UpdateEmergencyModal from "./Updateemergencymodal";
import DeleteEmergencyModal from "./Deleteemergencymodal";

type EmergencyStatus =
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED";

interface Emergency {
    id: string;
    status: EmergencyStatus;
    description: string;
    address: string;
    district: string;
    isPriority: boolean;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

const STATUS_STYLES: Record<EmergencyStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
    IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-300",
    RESOLVED: "bg-green-100 text-green-800 border-green-300",
    CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_DOT: Record<EmergencyStatus, string> = {
    PENDING: "bg-yellow-400",
    ACCEPTED: "bg-blue-500",
    IN_PROGRESS: "bg-orange-500",
    RESOLVED: "bg-green-500",
    CANCELLED: "bg-gray-400",
};

export default function MyEmergency() {
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [updateTarget, setUpdateTarget] = useState<Emergency | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const fetchEmergencies = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await emergencyApi.getAll();
            setEmergencies(res.data || []);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Failed to load emergencies. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencies();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                My Emergencies
                            </h1>
                            <p className="text-xs text-gray-400">
                                {emergencies.length} report
                                {emergencies.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchEmergencies}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
                    >
                        <svg
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                                    </div>
                                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                </div>
                                <div className="mt-4 h-3 bg-gray-100 rounded w-full" />
                                <div className="mt-2 h-3 bg-gray-100 rounded w-4/5" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-semibold">{error}</p>
                        <button
                            onClick={fetchEmergencies}
                            className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && emergencies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                            No emergency reports found.
                        </p>
                    </div>
                )}

                {/* Emergency List */}
                {!loading && !error && emergencies.length > 0 && (
                    <div className="space-y-4">
                        {emergencies.map((emergency) => (
                            <div
                                key={emergency.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[emergency.status]}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[emergency.status]}`}
                                            />
                                            {emergency.status.replace("_", " ")}
                                        </span>
                                        {emergency.isPriority && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Priority
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {new Date(emergency.createdAt).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-2">
                                    {emergency.description}
                                </p>

                                {/* Location */}
                                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span>
                                        {emergency.address}, {emergency.district}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between gap-3">
                                    <p className="text-xs text-gray-400 font-mono truncate">
                                        #{emergency.id.slice(0, 12)}...
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => setUpdateTarget(emergency)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                                        >
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            Update
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteTargetId(emergency.id)
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                                        >
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Modal */}
            {updateTarget && (
                <UpdateEmergencyModal
                    emergency={updateTarget}
                    onClose={() => setUpdateTarget(null)}
                    onSuccess={fetchEmergencies}
                />
            )}

            {/* Delete Modal */}
            {deleteTargetId && (
                <DeleteEmergencyModal
                    emergencyId={deleteTargetId}
                    onClose={() => setDeleteTargetId(null)}
                    onSuccess={fetchEmergencies}
                />
            )}
        </div>
    );
}