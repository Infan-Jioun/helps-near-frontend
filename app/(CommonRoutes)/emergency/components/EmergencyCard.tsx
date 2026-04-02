/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { User, Clock, MapPin, Star } from "lucide-react";

interface EmergencyCardProps {
    emergency: any;
    typeConfig: Record<string, any>;
    statusConfig: Record<string, any>;
    timeAgo: (dateStr: string) => string;
}

export default function EmergencyCard({ emergency, typeConfig, statusConfig, timeAgo }: EmergencyCardProps) {
    const tc = typeConfig[emergency.type] || typeConfig.OTHER;
    const sc = statusConfig[emergency.status] || statusConfig.PENDING;
    const Icon = tc.icon;

    return (
        <Link href={`/emergency/${emergency.id}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <div className="p-5 pb-3">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 ${tc.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${tc.color}`} strokeWidth={2} />
                            </div>
                            <div>
                                <span className={`text-xs font-semibold ${tc.color}`}>{tc.label}</span>
                                {emergency.isPriority && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-red-500 fill-red-500" />
                                        <span className="text-[10px] text-red-500 font-medium">Priority</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Badge className={`${sc.color} border text-[10px] px-2`}>{sc.label}</Badge>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-3">
                        {emergency.description || "Emergency reported — details not provided."}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                            {[emergency.address, emergency.district].filter(Boolean).join(", ") || "Location not specified"}
                        </span>
                    </div>
                </div>

                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[100px]">{emergency.user?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {emergency.responses?.length > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                                {emergency.responses.length} volunteer{emergency.responses.length > 1 ? "s" : ""}
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(emergency.createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}