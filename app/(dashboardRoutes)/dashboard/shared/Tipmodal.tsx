"use client";

import { useState } from "react";
import { VolunteerInfo } from "./types";
import { TIP_AMOUNTS } from "./config";

// ─────────────────────────────────────────────────────────────────────────────
// TipModal Component
// ─────────────────────────────────────────────────────────────────────────────

interface TipModalProps {
    volunteer: VolunteerInfo;
    emergencyId: string;
    onClose: () => void;
}

export default function TipModal({ volunteer, emergencyId, onClose }: TipModalProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
                            <button
                                onClick={onClose}
                                className="mt-2 w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-gray-900">Send a Tip</h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                                >
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

                            {/* Amount selector */}
                            <p className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-2">
                                Choose Amount (BDT)
                            </p>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {TIP_AMOUNTS.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelected(amt); setCustom(""); }}
                                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${selected === amt && !custom
                                            ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-200"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-red-300"
                                            }`}
                                    >
                                        ৳{amt}
                                    </button>
                                ))}
                            </div>

                            {/* Custom input */}
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

                            {/* Pay button */}
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