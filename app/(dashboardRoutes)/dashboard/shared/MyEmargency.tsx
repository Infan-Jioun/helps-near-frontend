/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface VolunteerResponse {
    id: string;
    message: string;
    createdAt: string;
    volunteer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        avatar?: string;
    };
}

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
    volunteerResponses?: VolunteerResponse[];
}

const STATUS_STYLES: Record<EmergencyStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-sky-50 text-sky-700 border-sky-200",
    IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-gray-50 text-gray-500 border-gray-200",
};

const STATUS_DOT: Record<EmergencyStatus, string> = {
    PENDING: "bg-amber-400",
    ACCEPTED: "bg-sky-500",
    IN_PROGRESS: "bg-orange-500",
    RESOLVED: "bg-emerald-500",
    CANCELLED: "bg-gray-400",
};

const TIP_AMOUNTS = [20, 50, 100, 200];

// ── Tip Modal ──────────────────────────────────────────────────────────────────
function TipModal({
    volunteer,
    emergencyId,
    onClose,
}: {
    volunteer: VolunteerResponse["volunteer"];
    emergencyId: string;
    onClose: () => void;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const amount = custom ? Number(custom) : selected;

    const handlePay = async () => {
        if (!amount || amount <= 0) return;
        setLoading(true);
        try {
            // TODO: replace with your actual payment API call
            // await paymentApi.sendTip({ emergencyId, volunteerId: volunteer.id, amount });
            await new Promise((r) => setTimeout(r, 1200)); // mock
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Top gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                <div className="p-6">
                    {success ? (
                        /* Success state */
                        <div className="flex flex-col items-center py-4 text-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-gray-900">Tip Sent!</p>
                            <p className="text-sm text-gray-500">
                                ৳{amount} sent to <span className="font-semibold text-gray-700">{volunteer.name}</span>. Thank you for your kindness!
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-gray-900">Send a Tip</h2>
                                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Volunteer info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-5">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                                    {volunteer.avatar ? (
                                        <img src={volunteer.avatar} alt={volunteer.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        volunteer.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{volunteer.name}</p>
                                    <p className="text-xs text-gray-400">{volunteer.phone}</p>
                                </div>
                            </div>

                            {/* Preset amounts */}
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Choose Amount (BDT)</p>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {TIP_AMOUNTS.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelected(amt); setCustom(""); }}
                                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${selected === amt && !custom
                                                ? "bg-teal-500 border-teal-500 text-white"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-teal-300"
                                            }`}
                                    >
                                        ৳{amt}
                                    </button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div className="relative mb-5">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">৳</span>
                                <input
                                    type="number"
                                    placeholder="Custom amount"
                                    value={custom}
                                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-sm font-medium transition"
                                />
                            </div>

                            {/* Pay button */}
                            <button
                                onClick={handlePay}
                                disabled={!amount || amount <= 0 || loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Send ৳{amount || "—"}
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Volunteer Response Card ────────────────────────────────────────────────────
function VolunteerResponseCard({
    response,
    emergencyId,
}: {
    response: VolunteerResponse;
    emergencyId: string;
}) {
    const [showTip, setShowTip] = useState(false);

    return (
        <>
            <div className="mt-4 border border-teal-100 bg-teal-50/60 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {response.volunteer.avatar ? (
                            <img
                                src={response.volunteer.avatar}
                                alt={response.volunteer.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            response.volunteer.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Volunteer name + badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800">
                                {response.volunteer.name}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Volunteer
                            </span>
                        </div>

                        {/* Phone */}
                        <p className="text-xs text-gray-400 mt-0.5">{response.volunteer.phone}</p>

                        {/* Message */}
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                            {response.message}
                        </p>

                        {/* Footer */}
                        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-xs text-gray-400">
                                {new Date(response.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>

                            {/* Tip Button */}
                            <button
                                onClick={() => setShowTip(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 transition shadow-sm shadow-orange-200"
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                Send Tip
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showTip && (
                <TipModal
                    volunteer={response.volunteer}
                    emergencyId={emergencyId}
                    onClose={() => setShowTip(false)}
                />
            )}
        </>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MyEmergency() {
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [updateTarget, setUpdateTarget] = useState<Emergency | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const fetchEmergencies = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await emergencyApi.getMyEmergencies();
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

    const toggleExpand = (id: string) =>
        setExpandedId((prev) => (prev === id ? null : id));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">My Emergencies</h1>
                            <p className="text-xs text-gray-400">
                                {emergencies.length} report{emergencies.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchEmergencies}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
                    >
                        <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
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
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-semibold">{error}</p>
                        <button onClick={fetchEmergencies} className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && emergencies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No emergency reports found.</p>
                    </div>
                )}

                {/* Emergency List */}
                {!loading && !error && emergencies.length > 0 && (
                    <div className="space-y-4">
                        {emergencies.map((emergency) => {
                            const hasResponses =
                                emergency.volunteerResponses &&
                                emergency.volunteerResponses.length > 0;
                            const isExpanded = expandedId === emergency.id;

                            return (
                                <div
                                    key={emergency.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[emergency.status]}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[emergency.status]}`} />
                                                {emergency.status.replace("_", " ")}
                                            </span>
                                            {emergency.isPriority && (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                    </svg>
                                                    Priority
                                                </span>
                                            )}
                                            {/* Volunteer response badge */}
                                            {hasResponses && (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                    {emergency.volunteerResponses!.length} Response
                                                    {emergency.volunteerResponses!.length > 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {new Date(emergency.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-2">
                                        {emergency.description}
                                    </p>

                                    {/* Location */}
                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{emergency.address}, {emergency.district}</span>
                                    </div>

                                    {/* Volunteer Responses (expandable) */}
                                    {hasResponses && (
                                        <div>
                                            <button
                                                onClick={() => toggleExpand(emergency.id)}
                                                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
                                            >
                                                <svg
                                                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                {isExpanded ? "Hide" : "View"} Volunteer Response
                                                {emergency.volunteerResponses!.length > 1 ? "s" : ""}
                                            </button>

                                            {isExpanded && (
                                                <div className="space-y-3">
                                                    {emergency.volunteerResponses!.map((vr) => (
                                                        <VolunteerResponseCard
                                                            key={vr.id}
                                                            response={vr}
                                                            emergencyId={emergency.id}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Divider + Actions */}
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between gap-3">
                                        <p className="text-xs text-gray-400 font-mono truncate">
                                            #{emergency.id.slice(0, 12)}...
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => setUpdateTarget(emergency)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Update
                                            </button>
                                            <button
                                                onClick={() => setDeleteTargetId(emergency.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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