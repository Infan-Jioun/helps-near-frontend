"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MapPin, User, Star, Clock, AlertTriangle } from "lucide-react";
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

    const fetchEmergency = async () => {
        try {
            setLoading(true);
            const res = await emergencyApi.getById(id as string);
            setEmergency(res.data); // API returns {data: {...}}
        } catch (err: any) {
            setError("Emergency details load করা সম্ভব হয়নি।");
        } finally {
            setLoading(false);
        }
    };

    const handleVolunteer = async () => {
        if (!emergency) return;
        try {
            setVolunteering(true);
            await volunteerResponseApi.accept(emergency.id);
            await fetchEmergency(); // refresh data to show volunteer in list
        } catch (err: any) {
            alert("Volunteer করতে সমস্যা হয়েছে।");
        } finally {
            setVolunteering(false);
        }
    };

    useEffect(() => {
        if (id) fetchEmergency();
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );

    if (error || !emergency)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-400">
                <AlertTriangle className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-lg font-medium">{error || "Emergency পাওয়া যায়নি।"}</p>
                <Button variant="destructive" className="mt-4" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
        );

    const type = typeConfig[emergency.type] || typeConfig.OTHER;
    const status = statusConfig[emergency.status] || statusConfig.PENDING;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-4xl mx-auto rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-2xl font-bold ${type.color}`}>
                        {type.label} Emergency {emergency.isPriority && <Star className="w-5 h-5 text-red-500" />}
                    </CardTitle>
                    <CardDescription>
                        <Badge className={`${status.color} px-3 py-1 rounded-xl`}>{status.label}</Badge>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-1">Description</h2>
                        <p>{emergency.description || "কোনো বিবরণ নেই।"}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{[emergency.address, emergency.district].filter(Boolean).join(", ") || "Location not specified"}</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-500">
                        <User className="w-4 h-4" />
                        <span>Reported by: {emergency.user?.name || "Anonymous"}</span>
                        {emergency.user?.phone && <span>({emergency.user.phone})</span>}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Reported: {timeAgo(emergency.createdAt)}</span>
                    </div>

                    {emergency.responses?.length > 0 && (
                        <div>
                            <h2 className="font-semibold mb-2">Volunteers Responded ({emergency.responses.length})</h2>
                            <ScrollArea className="max-h-40 border rounded-md p-2">
                                <ul className="list-disc list-inside text-gray-700">
                                    {emergency.responses.map((r) => (
                                        <li key={r.id}>{r.name} {r.phone && `(${r.phone})`}</li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </div>
                    )}

                    {emergency.latitude && emergency.longitude && (
                        <div className="mt-4 h-64 w-full rounded-xl overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                loading="lazy"
                                src={`https://maps.google.com/maps?q=${emergency.latitude},${emergency.longitude}&z=15&output=embed`}
                                title="Emergency Location"
                            />
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-3 mt-6">
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            onClick={handleVolunteer}
                            disabled={volunteering}
                        >
                            {volunteering ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Volunteer Help"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}