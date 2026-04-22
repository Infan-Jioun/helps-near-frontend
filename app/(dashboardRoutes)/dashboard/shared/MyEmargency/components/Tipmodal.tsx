/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { VolunteerInfo } from "./types";
import { TIP_AMOUNTS } from "./config";
import { paymentApi } from "@/lib/paymentApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TipModalProps {
    volunteer: VolunteerInfo;
    emergencyId: string;
    onClose: () => void;
}

const CARD_STYLE = {
    style: {
        base: {
            fontSize: "14px",
            color: "#0f172a",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
            "::placeholder": { color: "#94a3b8" },
        },
        invalid: { color: "#ef4444", iconColor: "#ef4444" },
    },
    hidePostalCode: true,
};

// ── Animated checkmark SVG ──────────────────────────────────────────────────
function AnimatedCheck() {
    return (
        <svg viewBox="0 0 52 52" className="w-16 h-16">
            <circle
                cx="26" cy="26" r="25"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="157"
                strokeDashoffset="157"
                style={{ animation: "dash-circle 0.6s ease forwards" }}
            />
            <path
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-16"
                strokeDasharray="40"
                strokeDashoffset="40"
                style={{ animation: "dash-check 0.4s ease 0.5s forwards" }}
            />
            <style>{`
                @keyframes dash-circle {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes dash-check {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </svg>
    );
}

// ── Confetti particle ───────────────────────────────────────────────────────
function Confetti() {
    const pieces = Array.from({ length: 20 }, (_, i) => i);
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {pieces.map((i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-sm"
                    style={{
                        backgroundColor: colors[i % colors.length],
                        left: `${(i * 17 + 5) % 90 + 5}%`,
                        top: "-8px",
                        animation: `confetti-fall ${0.8 + (i % 5) * 0.2}s ease ${(i % 7) * 0.08}s forwards`,
                        transform: `rotate(${i * 37}deg)`,
                        opacity: 0,
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(280px) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function TipModal({ volunteer, emergencyId, onClose }: TipModalProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardReady, setCardReady] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [open, setOpen] = useState(true);

    const amount = custom ? Number(custom) : selected;
    const profile = volunteer?.volunteerProfile;

    useEffect(() => {
        if (success) setShowConfetti(true);
    }, [success]);

    const handleClose = () => {
        setOpen(false);
        setTimeout(onClose, 200);
    };

    const handlePay = async () => {
        if (!amount || amount <= 0) return;
        if (!stripe || !elements) return;
        const card = elements.getElement(CardElement);
        if (!card) return;

        setLoading(true);
        setError(null);

        try {
            const { data } = await paymentApi.createIntent({ emergencyId, amount });

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card,
                        billing_details: { name: volunteer.name },
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message ?? "Payment failed. Please try again.");
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                await paymentApi.confirmPayment(paymentIntent.id);
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="p-0 gap-0 max-w-md w-full rounded-2xl overflow-hidden border-0 shadow-2xl">

                {/* ── Top gradient bar ── */}
                <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />

                {success ? (
                    /* ════════════════════════════════
                       SUCCESS SCREEN
                    ════════════════════════════════ */
                    <div className="relative flex flex-col items-center py-10 px-6 text-center bg-white">
                        {showConfetti && <Confetti />}

                        <AnimatedCheck />

                        <h2 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">
                            Payment Sent!
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                            Your tip of{" "}
                            <span className="font-bold text-slate-800">${amount} USD</span>{" "}
                            was successfully sent to
                        </p>

                        {/* Volunteer pill */}
                        <div className="mt-4 flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5">
                            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                {volunteer.profileImage
                                    ? <img src={volunteer.profileImage} alt={volunteer.name} className="w-full h-full object-cover" />
                                    : volunteer.name.charAt(0).toUpperCase()
                                }
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">{volunteer.name}</p>
                                <p className="text-xs text-slate-400">{volunteer.phone ?? "Volunteer"}</p>
                            </div>
                        </div>

                        {/* Receipt row */}
                        <div className="mt-6 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Amount paid</span>
                            <span className="text-sm font-black text-emerald-600">${amount}.00 USD</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Payment method</span>
                            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="1.5" />
                                    <path d="M2 10h20" strokeWidth="1.5" />
                                </svg>
                                Credit / Debit Card
                            </span>
                        </div>

                        <p className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secured & processed by Stripe
                        </p>

                        <Button
                            onClick={handleClose}
                            className="mt-6 w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    /* ════════════════════════════════
                       PAYMENT FORM
                    ════════════════════════════════ */
                    <div className="bg-white">
                        <DialogHeader className="px-6 pt-6 pb-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
                                        Send a Tip
                                    </DialogTitle>
                                    <p className="text-xs text-slate-400 mt-0.5">Support this volunteer</p>
                                </div>
                                {/* Volunteer mini chip */}
                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-2.5 py-1.5">
                                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0 overflow-hidden">
                                        {volunteer.profileImage
                                            ? <img src={volunteer.profileImage} alt={volunteer.name} className="w-full h-full object-cover" />
                                            : volunteer.name.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <span className="text-xs font-semibold text-red-700 max-w-[90px] truncate">
                                        {volunteer.name}
                                    </span>
                                    {profile?.isVerified && (
                                        <svg className="w-3 h-3 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="px-6 pt-5 pb-6 space-y-5">

                            {/* ── Amount grid ── */}
                            <div>
                                <p className="text-[10px] font-black tracking-[0.12em] text-slate-400 uppercase mb-2.5">
                                    Select Amount (USD)
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {TIP_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => { setSelected(amt); setCustom(""); }}
                                            className={cn(
                                                "relative py-3 rounded-xl text-sm font-bold border-2 transition-all duration-150",
                                                selected === amt && !custom
                                                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200 scale-[1.03]"
                                                    : "bg-white border-slate-200 text-slate-700 hover:border-red-300 hover:bg-red-50"
                                            )}
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Custom amount ── */}
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm select-none">$</span>
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Custom amount"
                                    value={custom}
                                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none text-sm font-semibold text-slate-800 transition placeholder:text-slate-400 placeholder:font-normal"
                                />
                                {custom && (
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">USD</span>
                                )}
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* ── Stripe Card ── */}
                            <div>
                                <p className="text-[10px] font-black tracking-[0.12em] text-slate-400 uppercase mb-2.5">
                                    Card Details
                                </p>
                                <div
                                    className={cn(
                                        "px-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-slate-50",
                                        cardReady ? "border-slate-300" : "border-slate-200",
                                        "focus-within:border-red-400 focus-within:bg-white focus-within:shadow-sm"
                                    )}
                                >
                                    <CardElement
                                        options={CARD_STYLE}
                                        onReady={() => setCardReady(true)}
                                        onChange={(e) => {
                                            if (e.error) setError(e.error.message ?? null);
                                            else setError(null);
                                        }}
                                    />
                                </div>

                                {/* Test card hint */}
                                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Test: <span className="font-mono font-semibold text-slate-500">4242 4242 4242 4242</span> · any future date · any CVC
                                </div>
                            </div>

                            {/* ── Error ── */}
                            {error && (
                                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            {/* ── Summary row ── */}
                            {amount && amount > 0 && (
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                    <span className="text-xs text-slate-500 font-medium">You&apos;re paying</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base font-black text-slate-900">${amount}</span>
                                        <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-md">USD</Badge>
                                    </div>
                                </div>
                            )}

                            {/* ── Pay button ── */}
                            <Button
                                onClick={handlePay}
                                disabled={!amount || amount <= 0 || loading || !stripe || !cardReady}
                                className={cn(
                                    "w-full h-12 rounded-xl font-black text-sm tracking-wide transition-all duration-200",
                                    "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
                                    "text-white shadow-lg shadow-red-200",
                                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Processing…
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        {amount && amount > 0 ? `Pay $${amount} USD` : "Pay"}
                                    </span>
                                )}
                            </Button>

                            {/* ── Stripe badge ── */}
                            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Payments are encrypted & secured by Stripe
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}