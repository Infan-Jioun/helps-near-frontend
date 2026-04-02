/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export interface Volunteer {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface VolunteerResponse {
    id: string;
    message: string;
    createdAt: string;
    volunteer: Volunteer;
}

interface Props {
    emergencyId: string;
    responses?: VolunteerResponse[];
}

const TIP_AMOUNTS = [20, 50, 100, 200];

export default function Response({ emergencyId, responses = [] }: Props) {
    // Tip Modal Component
    const TipModal = ({
        volunteer,
        onClose,
    }: {
        volunteer: Volunteer;
        onClose: () => void;
    }) => {
        const [selected, setSelected] = useState<number | null>(null);
        const [custom, setCustom] = useState("");
        const [loadingTip, setLoadingTip] = useState(false);
        const [success, setSuccess] = useState(false);

        const amount = custom ? Number(custom) : selected;

        const handlePay = async () => {
            if (!amount || amount <= 0) return;
            setLoadingTip(true);
            try {
                await new Promise((r) => setTimeout(r, 1200)); // mock payment
                setSuccess(true);
            } finally {
                setLoadingTip(false);
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                    <div className="p-6">
                        {success ? (
                            <div className="flex flex-col items-center py-4 text-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-emerald-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-gray-900">Tip Sent!</p>
                                <p className="text-sm text-gray-500">
                                    ৳{amount} sent to{" "}
                                    <span className="font-semibold text-gray-700">{volunteer.name}</span>.
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
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-base font-bold text-gray-900">Send a Tip</h2>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-5">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                                        {volunteer.avatar ? (
                                            <img
                                                src={volunteer.avatar}
                                                alt={volunteer.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            volunteer.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{volunteer.name}</p>
                                        <p className="text-xs text-gray-400">{volunteer.phone}</p>
                                    </div>
                                </div>

                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Choose Amount (BDT)
                                </p>
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {TIP_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => {
                                                setSelected(amt);
                                                setCustom("");
                                            }}
                                            className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${selected === amt && !custom
                                                ? "bg-teal-500 border-teal-500 text-white"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-teal-300"
                                                }`}
                                        >
                                            ৳{amt}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative mb-5">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                        ৳
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="Custom amount"
                                        value={custom}
                                        onChange={(e) => {
                                            setCustom(e.target.value);
                                            setSelected(null);
                                        }}
                                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-sm font-medium transition"
                                    />
                                </div>

                                <button
                                    onClick={handlePay}
                                    disabled={!amount || amount <= 0 || loadingTip}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {loadingTip ? "Processing…" : `Send ৳${amount || "—"}`}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Volunteer Response Card
    const VolunteerCard = ({ response }: { response: VolunteerResponse }) => {
        const [showTip, setShowTip] = useState(false);

        return (
            <div className="mt-4 border border-teal-100 bg-teal-50/60 rounded-2xl p-4">
                <div className="flex items-start gap-3">
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
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800">{response.volunteer.name}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                                Volunteer
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-0.5">{response.volunteer.phone}</p>
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{response.message}</p>

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

                            <button
                                onClick={() => setShowTip(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 transition shadow-sm shadow-orange-200"
                            >
                                Send Tip
                            </button>
                        </div>
                    </div>
                </div>

                {showTip && (
                    <TipModal
                        volunteer={response.volunteer}
                        onClose={() => setShowTip(false)}
                        emergencyId={emergencyId}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {responses.length === 0 && (
                <p className="text-gray-500 text-sm">No volunteer responses yet.</p>
            )}
            {responses.map((resp) => (
                <VolunteerCard key={resp.id} response={resp} />
            ))}
        </div>
    );
}