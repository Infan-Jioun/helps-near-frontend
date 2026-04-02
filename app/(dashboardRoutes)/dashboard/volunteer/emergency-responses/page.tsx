"use client";

import { useEffect, useState } from "react";
import {
    Loader2, MapPin, Phone, Clock, AlertCircle,
    ShieldCheck, Award, Mail, PhoneCall
} from "lucide-react";
import { volunteerResponseApi } from "@/lib/volunteerResponseApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Volunteer {
    id: string;
    name: string;
    phone?: string;
    volunteerProfile?: {
        skills?: string[];
        averageRating?: number;
        isVerified?: boolean;
        totalHelped?: number;
        bio?: string;
    };
}

interface Emergency {
    id: string;
    type: string;
    status: string;
    description: string | null;
    address: string | null;
    district: string | null;
    latitude: number;
    longitude: number;
    isPriority: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
    };
}

interface VolunteerResponse {
    id: string;
    volunteer: Volunteer;
    emergency: Emergency;
    estimatedArrivalMin?: number;
}

export default function EmergencyResponsesPage() {
    const [responses, setResponses] = useState<VolunteerResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const res = await volunteerResponseApi.getMyResponses();
            setResponses(res.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to fetch responses.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (emergencyId: string) => {
        try {
            setProcessingId(emergencyId);
            await volunteerResponseApi.cancel(emergencyId);
            toast.success("Your response has been cancelled.");
            await fetchResponses();
        } catch (err) {
            toast.error("Failed to cancel response.");
        } finally {
            setProcessingId(null);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-red-600" />
                <p className="text-red-600 font-medium animate-pulse">Syncing Emergency Data...</p>
            </div>
        );
    }

    const myProfile = responses.length > 0 ? responses[0].volunteer : null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* --- Volunteer Header --- */}
                {myProfile && (
                    <Card className="border-none shadow-lg bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${myProfile.name}`} />
                                    <AvatarFallback className="bg-white text-red-700 font-bold text-xl">
                                        {myProfile.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                                        <h2 className="text-3xl font-extrabold tracking-tight">{myProfile.name}</h2>
                                        {myProfile.volunteerProfile?.isVerified && (
                                            <Badge className="bg-green-500/20 text-green-100 border-green-500/30 backdrop-blur-md">
                                                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Volunteer
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-red-100 mt-2 max-w-2xl italic">
                                        {myProfile.volunteerProfile?.bio || "Dedicated to saving lives."}
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full">
                                            <Award className="w-4 h-4" />
                                            <span>{myProfile.volunteerProfile?.totalHelped || 0} Helped</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full">
                                            <Phone className="w-4 h-4" />
                                            <span>{myProfile.phone || "No Phone"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* --- Active Missions --- */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle className="text-red-600" /> Active Missions
                        </h2>
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                            {responses.length} Tasks
                        </Badge>
                    </div>

                    <ScrollArea className="h-[calc(100vh-350px)] rounded-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                            {responses.map((res) => {
                                const e = res.emergency;
                                return (
                                    <Card key={res.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                                        <div className={`h-1.5 w-full ${e.isPriority ? "bg-red-600 animate-pulse" : "bg-orange-500"}`} />

                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Badge className={e.isPriority ? "bg-red-600 mb-2" : "bg-orange-500 mb-2"}>{e.type}</Badge>
                                                    <CardTitle className="text-xl font-bold text-slate-800">{e.type} Emergency</CardTitle>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                                                    <p className="text-sm font-bold text-red-600">{e.status}</p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Reporter Contact Info */}
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-white shadow-sm">
                                                        <AvatarFallback className="bg-red-100 text-red-700 font-bold text-xs">
                                                            {e.user.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Reporter</p>
                                                        <p className="text-sm font-bold text-slate-700">{e.user.name}</p>
                                                    </div>
                                                    {e.user.phone && (
                                                        <a href={`tel:${e.user.phone}`}>
                                                            <Button size="icon" variant="ghost" className="rounded-full text-green-600 hover:bg-green-50">
                                                                <PhoneCall className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200/60">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="truncate">Email: {e.user.email || "Not provided"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Phone: {e.user.phone || "Not provided"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 italic leading-relaxed">
                                                {e.description ? `"${e.description}"` : "No description provided."}
                                            </p>

                                            <div className="flex items-start gap-2 text-sm text-slate-500">
                                                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                                <span>{[e.address, e.district].filter(Boolean).join(", ")}</span>
                                            </div>

                                            <Separator />

                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                {res.estimatedArrivalMin && (
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                        ETA: {res.estimatedArrivalMin} mins
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="bg-slate-50/50 p-4 flex justify-end">
                                            <Button
                                                variant="outline" size="sm"
                                                className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-colors"
                                                onClick={() => handleCancel(e.id)}
                                                disabled={processingId === e.id}
                                            >
                                                {processingId === e.id && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                                Cancel Response
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}