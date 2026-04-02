"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MapPin, User, Star, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { emergencyApi } from "@/lib/emergencyApi";
import { volunteerResponseApi } from "@/lib/volunteerResponseApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const typeConfig: Record<string, { label: string; color: string }> = {
    MEDICAL: { label: "Medical", color: "text-red-600" },
    FIRE: { label: "Fire", color: "text-orange-600" },
    ACCIDENT: { label: "Accident", color: "text-yellow-600" },
    FLOOD: { label: "Flood", color: "text-blue-600" },
    CRIME: { label: "Crime", color: "text-purple-600" },
    OTHER: { label: "Other", color: "text-gray-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
    RESOLVED: { label: "Resolved", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
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

export default function EmergencyDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [emergency, setEmergency] = useState<Emergency | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [volunteering, setVolunteering] = useState(false);

    // Add state for the logged-in user's role
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchEmergency = async () => {
        try {
            setLoading(true);
            const res = await emergencyApi.getById(id as string);
            setEmergency(res.data);
        } catch (err: any) {
            const errorMsg = "Failed to load emergency details.";
            setError(errorMsg);
            toast.error(errorMsg);
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
        } catch (err: any) {
            toast.error("Failed to volunteer. Please try again.");
        } finally {
            setVolunteering(false);
        }
    };

    useEffect(() => {
        if (id) fetchEmergency();

        // TODO: Replace this with your actual Auth logic (e.g., useSession from NextAuth, context, or API call)
        // Example: const role = localStorage.getItem("userRole");
        // For demonstration, setting it manually to "VOLUNTEER"
        const currentRole = "VOLUNTEER";
        setUserRole(currentRole);
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    if (error || !emergency) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-400">
                <AlertTriangle className="w-12 h-12 mb-4 text-red-500 opacity-50" />
                <p className="text-lg font-medium text-gray-600">{error || "Emergency not found."}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    const type = typeConfig[emergency.type] || typeConfig.OTHER;
    const status = statusConfig[emergency.status] || statusConfig.PENDING;
    const isResolvedOrCancelled = status.label === "Resolved" || status.label === "Cancelled";

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-4xl mx-auto rounded-2xl shadow-sm border-gray-200">
                <CardHeader className="border-b bg-white rounded-t-2xl pb-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className={`flex items-center gap-2 text-2xl font-bold ${type.color}`}>
                                {type.label} Emergency {emergency.isPriority && <Star className="w-5 h-5 text-red-500 fill-current" />}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className={`${status.color} px-3 py-1 rounded-full font-medium border-0`}>
                                    {status.label}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    {timeAgo(emergency.createdAt)}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 pt-6 bg-white rounded-b-2xl">
                    {/* Description Section */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h2>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {emergency.description || "No description available for this emergency."}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                                <p className="text-gray-800 font-medium">
                                    {[emergency.address, emergency.district].filter(Boolean).join(", ") || "Location not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <User className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Reported By</p>
                                <p className="text-gray-800 font-medium">
                                    {emergency.user?.name || "Anonymous"}
                                    {emergency.user?.phone && <span className="text-gray-500 font-normal ml-1">({emergency.user.phone})</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Responders Section */}
                    {emergency.responses?.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                                Volunteers Responded ({emergency.responses.length})
                            </h2>
                            <ScrollArea className="max-h-40 border border-gray-100 rounded-xl bg-gray-50 p-4">
                                <ul className="space-y-2">
                                    {emergency.responses.map((r) => (
                                        <li key={r.id} className="flex items-center gap-2 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="font-medium">{r.name}</span>
                                            {r.phone && <span className="text-gray-500 text-sm">({r.phone})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Map Section */}
                    {emergency.latitude && emergency.longitude && (
                        <div className="mt-2 h-72 w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                            <iframe
                                width="100%"
                                height="100%"
                                loading="lazy"
                                src={`http://googleusercontent.com/maps.google.com/maps?q=${emergency.latitude},${emergency.longitude}&z=15&output=embed`}
                                title="Emergency Location"
                                className="border-0"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Button
                            variant="outline"
                            className="flex-1 py-6 text-base font-medium"
                            onClick={() => router.back()}
                        >
                            Go Back
                        </Button>


                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 py-6 text-base font-medium transition-colors"
                            onClick={handleVolunteer}
                            disabled={
                                userRole !== "VOLUNTEER" || volunteering || isResolvedOrCancelled
                            }
                        >
                            {volunteering ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Volunteer Help"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}