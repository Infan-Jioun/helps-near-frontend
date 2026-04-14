/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { emergencyApi } from "@/lib/emergencyApi";
import UpdateEmergencyModal from "./Updateemergencymodal";
import DeleteEmergencyModal from "./Deleteemergencymodal";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type EmergencyStatus =
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED";

interface VolunteerProfile {
    skills?: string[];
    averageRating?: number;
    isVerified?: boolean;
    fee?: number;
    isFree?: boolean;
    bio?: string;
}

interface VolunteerInfo {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    volunteerProfile?: VolunteerProfile | null;
}

interface VolunteerResponse {
    id: string;
    message?: string | null;
    estimatedArrivalMin?: number | null;
    acceptedAt?: string | null;
    createdAt?: string | null;
    volunteer: VolunteerInfo;
}

interface Emergency {
    id: string;
    status: EmergencyStatus;
    description: string;
    address: string;
    district: string;
    isPriority: boolean;
    createdAt: string;
    type?: string;
    user?: { id: string; name: string; email: string; phone: string };
    responses?: VolunteerResponse[];
    volunteerResponses?: VolunteerResponse[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getResponses(e: Emergency): VolunteerResponse[] {
    return e.responses ?? e.volunteerResponses ?? [];
}

/** Safe client-only date format — avoids SSR/client hydration mismatch */
function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const day   = String(d.getDate()).padStart(2, "0");
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const year  = d.getFullYear();
    const hh    = String(d.getHours()).padStart(2, "0");
    const mm    = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hh}:${mm}`;
}

function formatDateShort(dateStr?: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const day   = String(d.getDate()).padStart(2, "0");
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const year  = d.getFullYear();
    return `${day} ${month} ${year}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<EmergencyStatus, string> = {
    PENDING:     "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED:    "bg-sky-50 text-sky-700 border-sky-200",
    IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
    RESOLVED:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED:   "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_DOT: Record<EmergencyStatus, string> = {
    PENDING:     "bg-amber-400",
    ACCEPTED:    "bg-sky-500",
    IN_PROGRESS: "bg-orange-500 animate-pulse",
    RESOLVED:    "bg-emerald-500",
    CANCELLED:   "bg-gray-400",
};

const STATUS_STRIPE: Record<EmergencyStatus, string> = {
    PENDING:     "bg-amber-300",
    ACCEPTED:    "bg-sky-400",
    IN_PROGRESS: "bg-orange-400",
    RESOLVED:    "bg-emerald-400",
    CANCELLED:   "bg-gray-300",
};

const TYPE_EMOJI: Record<string, string> = {
    MEDICAL: "🚑", FIRE: "🔥", ACCIDENT: "💥",
    FLOOD: "🌊", CRIME: "🚨", OTHER: "⚠️",
};

const TIP_AMOUNTS = [20, 50, 100, 200];

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-0.5 bg-red-100" />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-6 rounded bg-red-50" />
                        <div className="h-6 w-24 rounded-full bg-red-100" />
                        <div className="h-6 w-16 rounded-full bg-red-50" />
                    </div>
                    <div className="h-4 w-20 rounded bg-gray-100" />
                </div>
                <div className="space-y-2 mb-3">
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-4/5 rounded bg-gray-100" />
                </div>
                <div className="h-3 w-40 rounded bg-red-50 mb-4" />
                <div className="border-t border-red-50 pt-4 flex justify-between">
                    <div className="h-3 w-28 rounded bg-gray-100" />
                    <div className="flex gap-2">
                        <div className="h-7 w-20 rounded-lg bg-blue-50" />
                        <div className="h-7 w-20 rounded-lg bg-red-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tip Modal
// ─────────────────────────────────────────────────────────────────────────────
function TipModal({
    volunteer,
    emergencyId,
    onClose,
}: {
    volunteer: VolunteerInfo;
    emergencyId: string;
    onClose: () => void;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom]     = useState("");
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);

    const amount = custom ? Number(custom) : selected;
    const profile = volunteer?.volunteerProfile;

    const handlePay = async () => {
        if (!amount || amount <= 0) return;
        setLoading(true);
        try {
            // TODO: await paymentApi.sendTip({ emergencyId, volunteerId: volunteer.id, amount });
            await new Promise((r) => setTimeout(r, 1200));
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center py-6 text-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-gray-900">Tip Sent! 🎉</p>
                            <p className="text-sm text-gray-500">
                                ৳{amount} sent to{" "}
                                <span className="font-semibold text-gray-700">{volunteer?.name}</span>
                            </p>
                            <button onClick={onClose} className="mt-2 w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition">
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-gray-900">Send a Tip</h2>
                                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Volunteer chip */}
                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-100 mb-5">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                    {volunteer?.profileImage
                                        ? <img src={volunteer.profileImage} alt={volunteer.name} className="w-full h-full object-cover" />
                                        : (volunteer?.name?.charAt(0)?.toUpperCase() ?? "V")
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{volunteer?.name}</p>
                                    <p className="text-xs text-gray-400">{volunteer?.phone ?? "—"}</p>
                                </div>
                                {profile?.isFree === false && profile?.fee != null && (
                                    <span className="ml-auto text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-lg">
                                        ৳{profile.fee} fee
                                    </span>
                                )}
                            </div>

                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-2">Choose Amount (BDT)</p>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {TIP_AMOUNTS.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelected(amt); setCustom(""); }}
                                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                                            selected === amt && !custom
                                                ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-200"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-red-300"
                                        }`}
                                    >
                                        ৳{amt}
                                    </button>
                                ))}
                            </div>

                            <div className="relative mb-5">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">৳</span>
                                <input
                                    type="number"
                                    placeholder="Custom amount"
                                    value={custom}
                                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm font-medium transition"
                                />
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!amount || amount <= 0 || loading}
                                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-red-200"
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
                                        Send ৳{amount ?? "—"}
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

// ─────────────────────────────────────────────────────────────────────────────
// Volunteer Response Card
// ─────────────────────────────────────────────────────────────────────────────
function VolunteerCard({
    response,
    emergencyId,
    isResolved,
}: {
    response: VolunteerResponse;
    emergencyId: string;
    isResolved: boolean;
}) {
    const [showTip, setShowTip] = useState(false);

    // ✅ Safe: guard against undefined volunteer
    const v       = response?.volunteer;
    const profile = v?.volunteerProfile ?? null;   // ✅ never crashes

    if (!v) return null;

    const initials = v.name?.charAt(0)?.toUpperCase() ?? "V";
    const dateStr  = formatDate(response.acceptedAt ?? response.createdAt);

    return (
        <>
            <div className="border border-red-100 bg-red-50/40 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                        {v.profileImage
                            ? <img src={v.profileImage} alt={v.name} className="w-full h-full object-cover" />
                            : initials
                        }
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Name + badges row */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold text-gray-800">{v.name}</p>

                            {profile?.isVerified && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                    ✓ Verified
                                </span>
                            )}

                            {profile?.isFree === true && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    Free
                                </span>
                            )}

                            {profile?.isFree === false && profile?.fee != null && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                    ৳{profile.fee}
                                </span>
                            )}

                            {profile?.averageRating != null && (
                                <span className="text-[10px] text-amber-500 font-bold">
                                    ★ {Number(profile.averageRating).toFixed(1)}
                                </span>
                            )}
                        </div>

                        {/* Phone */}
                        {v.phone && (
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {v.phone}
                            </p>
                        )}

                        {/* Skills */}
                        {profile?.skills && profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {profile.skills.slice(0, 4).map((s) => (
                                    <span key={s} className="text-[10px] px-2 py-0.5 bg-white border border-red-100 text-red-600 rounded-full font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Message */}
                        {response.message && (
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-white rounded-xl px-3 py-2 border border-red-100">
                                &ldquo;{response.message}&rdquo;
                            </p>
                        )}

                        {/* ETA — ✅ shows when estimatedArrivalMin exists */}
                        {response.estimatedArrivalMin != null && response.estimatedArrivalMin > 0 && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-white border border-red-100 rounded-xl px-3 py-1.5">
                                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-700">
                                    ETA: ~{response.estimatedArrivalMin} min
                                </span>
                            </div>
                        )}

                        {/* Footer row */}
                        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-xs text-gray-400">{dateStr}</p>

                            {isResolved ? (
                                <button
                                    onClick={() => setShowTip(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition shadow-sm shadow-red-200"
                                >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                    Send Tip
                                </button>
                            ) : (
                                <span className="text-[10px] text-gray-400 italic bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                    💳 Tip unlocks after resolved
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showTip && (
                <TipModal
                    volunteer={v}
                    emergencyId={emergencyId}
                    onClose={() => setShowTip(false)}
                />
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MyEmergency() {
    const [emergencies, setEmergencies]       = useState<Emergency[]>([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState<string | null>(null);
    const [expandedId, setExpandedId]         = useState<string | null>(null);
    const [updateTarget, setUpdateTarget]     = useState<Emergency | null>(null);
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

    const toggleExpand = (id: string) =>
        setExpandedId((prev) => (prev === id ? null : id));

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
                        {emergencies.map((emergency) => {
                            const responses    = getResponses(emergency);
                            const hasResponses = responses.length > 0;
                            const isExpanded   = expandedId === emergency.id;
                            const isResolved   = emergency.status === "RESOLVED";

                            return (
                                <div
                                    key={emergency.id}
                                    className="bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Status stripe */}
                                    <div className={`h-0.5 ${STATUS_STRIPE[emergency.status] ?? "bg-gray-200"}`} />

                                    <div className="p-5">
                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {emergency.type && (
                                                    <span className="text-lg leading-none">
                                                        {TYPE_EMOJI[emergency.type] ?? "⚠️"}
                                                    </span>
                                                )}

                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[emergency.status]}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[emergency.status]}`} />
                                                    {emergency.status.replace("_", " ")}
                                                </span>

                                                {emergency.isPriority && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 tracking-wide">
                                                        ★ PRIORITY
                                                    </span>
                                                )}

                                                {hasResponses && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                                                        {responses.length} Volunteer{responses.length > 1 ? "s" : ""}
                                                    </span>
                                                )}

                                                {isResolved && hasResponses && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        💳 Tip Available
                                                    </span>
                                                )}
                                            </div>

                                            {/* ✅ No toLocaleDateString — no hydration mismatch */}
                                            <p className="text-xs text-gray-400 shrink-0">
                                                {formatDateShort(emergency.createdAt)}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-2">
                                            {emergency.description}
                                        </p>

                                        {/* Location */}
                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                                            <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{emergency.address}, {emergency.district}</span>
                                        </div>

                                        {/* Expand toggle */}
                                        {hasResponses && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => toggleExpand(emergency.id)}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition"
                                                >
                                                    <svg
                                                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {isExpanded ? "Hide" : "View"} Volunteer Response{responses.length > 1 ? "s" : ""}
                                                    {isResolved && !isExpanded && (
                                                        <span className="ml-1 text-emerald-500 font-medium">· tip ready</span>
                                                    )}
                                                </button>

                                                {isExpanded && (
                                                    <div className="mt-3 space-y-3">
                                                        {responses.map((vr) => (
                                                            <VolunteerCard
                                                                key={vr.id}
                                                                response={vr}
                                                                emergencyId={emergency.id}
                                                                isResolved={isResolved}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Waiting hint */}
                                        {!hasResponses && emergency.status === "PENDING" && (
                                            <p className="mt-3 text-xs text-gray-400 italic flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                                                Waiting for volunteers…
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="border-t border-red-50 mt-4 pt-4 flex items-center justify-between gap-3">
                                            <p className="text-xs text-gray-300 font-mono truncate">
                                                #{emergency.id.slice(0, 10)}…
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => setUpdateTarget(emergency)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTargetId(emergency.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
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