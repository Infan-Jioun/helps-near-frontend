"use client";

import { useState } from "react";
import { VolunteerResponse } from "./types";
import { formatDate } from "./utils";
import TipModal from "./Tipmodal";
import Image from "next/image";


interface VolunteerCardProps {
    response: VolunteerResponse;
    emergencyId: string;
    isResolved: boolean;
}

export default function VolunteerCard({ response, emergencyId, isResolved }: VolunteerCardProps) {
    const [showTip, setShowTip] = useState(false);

    const v = response?.volunteer;
    const profile = v?.volunteerProfile ?? null;

    if (!v) return null;

    const initials = v.name?.charAt(0)?.toUpperCase() ?? "V";
    const dateStr = formatDate(response.acceptedAt ?? response.createdAt);

    return (
        <>
            <div className="border border-red-100 bg-red-50/40 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                        {v.profileImage
                            ? <Image src={v.profileImage} alt={v.name} width={100} height={100} priority className="w-full h-full object-cover" />
                            : initials
                        }
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Name + badges */}
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

                        {/* ETA */}
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

                        {/* Footer */}
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