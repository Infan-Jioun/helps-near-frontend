"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin, User, Star, Clock, AlertTriangle,
    Shield, Phone, ChevronLeft, Users, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { emergencyApi } from "@/lib/emergencyApi";
import { volunteerResponseApi } from "@/lib/volunteerResponseApi";

interface Emergency {
    id: string;
    type: string;
    description: string | null;
    address: string | null;
    district: string | null;
    status: string;
    isPriority: boolean;
    createdAt: string;
    latitude: number;
    longitude: number;
    user: { name: string; phone: string | null };
    responses: { id: string; name: string; phone?: string }[];
}

const typeConfig: Record<string, { label: string; emoji: string; border: string; text: string }> = {
    MEDICAL: { label: "Medical", emoji: "🚑", border: "border-t-red-500", text: "text-red-500" },
    FIRE: { label: "Fire", emoji: "🔥", border: "border-t-orange-500", text: "text-orange-500" },
    ACCIDENT: { label: "Accident", emoji: "💥", border: "border-t-yellow-500", text: "text-yellow-600" },
    FLOOD: { label: "Flood", emoji: "🌊", border: "border-t-blue-500", text: "text-blue-500" },
    CRIME: { label: "Crime", emoji: "🚨", border: "border-t-purple-500", text: "text-purple-500" },
    OTHER: { label: "Other", emoji: "⚠️", border: "border-t-gray-400", text: "text-gray-500" },
};

const statusConfig: Record<string, { label: string; pill: string; dot: string }> = {
    PENDING: { label: "Pending", pill: "bg-yellow-50 text-yellow-700 border border-yellow-200", dot: "bg-yellow-400" },
    IN_PROGRESS: { label: "In Progress", pill: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400" },
    RESOLVED: { label: "Resolved", pill: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-400" },
    CANCELLED: { label: "Cancelled", pill: "bg-gray-100 text-gray-500 border border-gray-200", dot: "bg-gray-400" },
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

/* ─────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────── */
function SkeletonLoader() {
    return (
        <div className="min-h-screen bg-red-50/40 pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto space-y-4 animate-pulse">

                {/* Header card */}
                <div className="bg-white rounded-2xl border-t-4 border-t-red-200 border border-red-100 shadow-sm p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="h-9 w-20 rounded-xl bg-red-100" />
                        <div className="h-7 w-24 rounded-full bg-red-100" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-100" />
                        <div className="space-y-2">
                            <div className="h-8 w-56 rounded-lg bg-red-100" />
                            <div className="flex gap-2">
                                <div className="h-5 w-24 rounded-full bg-red-100" />
                                <div className="h-5 w-14 rounded-full bg-red-100" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 space-y-3">
                    <div className="h-3 w-20 rounded bg-red-100" />
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-5/6 rounded bg-gray-100" />
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-100 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-14 rounded bg-red-100" />
                                <div className="h-4 w-full rounded bg-gray-100" />
                                <div className="h-3 w-20 rounded bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map */}
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-red-50 flex gap-2">
                        <div className="h-3 w-4 rounded bg-red-100" />
                        <div className="h-3 w-32 rounded bg-red-100" />
                    </div>
                    <div className="h-64 bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                        <span className="text-5xl opacity-20">🗺️</span>
                    </div>
                    <div className="px-5 py-3 border-t border-red-50">
                        <div className="h-3 w-36 rounded bg-red-100" />
                    </div>
                </div>

                {/* Button */}
                <div className="h-14 w-full rounded-2xl bg-red-200" />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function EmergencyDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [emergency, setEmergency] = useState<Emergency | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [volunteering, setVolunteering] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchEmergency = async () => {
        try {
            setLoading(true);
            const res = await emergencyApi.getById(id as string);
            setEmergency(res.data);
        } catch {
            const msg = "Failed to load emergency details.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVolunteer = async () => {
        if (!emergency) return;
        try {
            setVolunteering(true);
            await volunteerResponseApi.accept(emergency.id);
            toast.success("Successfully volunteered to help!");
            await fetchEmergency();
        } catch {
            toast.error("Failed to volunteer. Please try again.");
        } finally {
            setVolunteering(false);
        }
    };

    useEffect(() => {
        if (id) fetchEmergency();
        setUserRole("VOLUNTEER");
    }, [id]);

    /* Loading */
    if (loading) return <SkeletonLoader />;

    /* Error */
    if (error || !emergency) {
        return (
            <div className="min-h-screen bg-red-50/40 flex flex-col items-center justify-center gap-4 px-4">
                <div className="bg-red-100 rounded-full p-5">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-gray-700 font-semibold text-lg text-center">
                    {error || "Emergency not found."}
                </p>
            
            </div>
        );
    }

    const type = typeConfig[emergency.type] || typeConfig.OTHER;
    const status = statusConfig[emergency.status] || statusConfig.PENDING;
    const isResolvedOrCancelled = emergency.status === "RESOLVED" || emergency.status === "CANCELLED";

    const mapSrc =
        `https://www.openstreetmap.org/export/embed.html` +
        `?bbox=${emergency.longitude - 0.01},${emergency.latitude - 0.01},${emergency.longitude + 0.01},${emergency.latitude + 0.01}` +
        `&layer=mapnik&marker=${emergency.latitude},${emergency.longitude}`;

    return (
        <div className="min-h-screen bg-red-50/40 pt-24 pb-16 px-4">
            {/* Top progress bar */}
            <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400 z-50" />

            <div className="max-w-3xl mx-auto space-y-4">

                {/* ── HEADER CARD ── */}
                <div className={`bg-white rounded-2xl border-t-4 border  shadow-sm`}>
                    <div className="p-6">
                   
                        {/* Type */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-4xl leading-none">{type.emoji}</span>
                            <div>
                                <h1 className={`text-3xl font-black tracking-tight leading-none ${type.text}`}>
                                    {type.label} Emergency
                                </h1>
                                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${status.pill}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                                        {status.label}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={11} /> {timeAgo(emergency.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DESCRIPTION ── */}
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                    <p className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-3">
                        Description
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {emergency.description || "No description provided for this emergency."}
                    </p>
                </div>

                {/* ── DETAILS GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex items-start gap-3">
                        <div className="bg-red-50 rounded-xl p-2.5 shrink-0">
                            <MapPin size={17} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-1">Location</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {[emergency.address, emergency.district].filter(Boolean).join(", ") || "Not specified"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex items-start gap-3">
                        <div className="bg-red-50 rounded-xl p-2.5 shrink-0">
                            <User size={17} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-1">Reported By</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {emergency.user?.name || "Anonymous"}
                            </p>
                            {emergency.user?.phone && (
                                <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                    <Phone size={10} /> {emergency.user.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RESPONDERS ── */}
                {emergency.responses?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={14} className="text-red-500" />
                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase">
                                Volunteers Responded
                            </p>
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
                                {emergency.responses.length}
                            </span>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
                            {emergency.responses.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                                    <span className="text-sm font-medium text-gray-800">{r.name}</span>
                                    {r.phone && (
                                        <span className="text-xs text-gray-400 ml-1">{r.phone}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── MAP (OpenStreetMap) ── */}
                {emergency.latitude && emergency.longitude && (
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-red-50">
                            <MapPin size={13} className="text-red-500" />
                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase">
                                Emergency Location
                            </p>
                        </div>
                        <iframe
                            width="100%"
                            height="280"
                            loading="lazy"
                            src={mapSrc}
                            title="Emergency Location"
                            className="border-0 block"
                        />
                        <div className="px-5 py-3 bg-red-50/50 border-t border-red-100">
                            <a
                                href={`https://www.openstreetmap.org/?mlat=${emergency.latitude}&mlon=${emergency.longitude}#map=16/${emergency.latitude}/${emergency.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-red-500 font-semibold hover:underline"
                            >
                                Open in OpenStreetMap ↗
                            </a>
                        </div>
                    </div>
                )}

                {/* ── VOLUNTEER BUTTON ── */}
                <button
                    onClick={handleVolunteer}
                    disabled={userRole !== "VOLUNTEER" || volunteering || isResolvedOrCancelled}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-[0.99]"
                >
                    {volunteering ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Shield size={18} />
                            Volunteer to Help
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}