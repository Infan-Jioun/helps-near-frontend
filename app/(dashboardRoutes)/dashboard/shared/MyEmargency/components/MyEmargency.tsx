/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { emergencyApi } from "@/lib/emergencyApi";


import UpdateEmergencyModal from "./Updateemergencymodal";
import { Emergency } from "./types";
import SkeletonCard from "./Skeletoncard";
import EmergencyCard from "./Emergencycard";
import DeleteEmergencyModal from "./Deleteemergencymodal";

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
            const res = await emergencyApi.getMyEmergencies();
            setEmergencies(res.data || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load emergencies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmergencies(); }, []);

    return (
        <div className="min-h-screen bg-red-50/30">
            {/* Thin top bar */}
            <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400 z-50" />

            {/* Sticky header */}
            <div className="bg-white border-b border-red-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-black text-gray-900 tracking-tight">My Emergencies</h1>
                            <p className="text-xs text-red-400 font-medium">
                                {emergencies.length} report{emergencies.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchEmergencies}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition disabled:opacity-40"
                    >
                        <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Page body */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                {/* Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-semibold">{error}</p>
                        <button onClick={fetchEmergencies} className="mt-4 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && emergencies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-2xl">📋</div>
                        <p className="text-gray-500 font-semibold">No emergency reports found.</p>
                        <p className="text-xs text-gray-400 mt-1">Your reports will appear here.</p>
                    </div>
                )}

                {/* List */}
                {!loading && !error && emergencies.length > 0 && (
                    <div className="space-y-4">
                        {emergencies.map((emergency) => (
                            <EmergencyCard
                                key={emergency.id}
                                emergency={emergency}
                                onUpdate={setUpdateTarget}
                                onDelete={setDeleteTargetId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {updateTarget && (
                <UpdateEmergencyModal
                    emergency={updateTarget}
                    onClose={() => setUpdateTarget(null)}
                    onSuccess={fetchEmergencies}
                />
            )}
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