"use client";

import { useState } from "react";
import { Emergency } from "./types";
import { getResponses, formatDateShort } from "./helpers";
import { STATUS_STYLES, STATUS_DOT, STATUS_STRIPE, TYPE_EMOJI } from "./config";
import VolunteerCard from "./Volunteercard";

interface EmergencyCardProps {
    emergency: Emergency;
    onUpdate: (emergency: Emergency) => void;
    onDelete: (id: string) => void;
}

export default function EmergencyCard({ emergency, onUpdate, onDelete }: EmergencyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const responses = getResponses(emergency);
    const hasResponses = responses.length > 0;
    const isResolved = emergency.status === "RESOLVED";

    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
                            onClick={() => setIsExpanded((prev) => !prev)}
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
                            onClick={() => onUpdate(emergency)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update
                        </button>
                        <button
                            onClick={() => onDelete(emergency.id)}
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
}