/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { authApi } from "@/lib/authApi";


export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pasted.every((c) => /\d/.test(c))) {
            setOtp([...pasted, ...Array(6 - pasted.length).fill("")]);
            inputRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join("");
        if (otpValue.length < 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await authApi.verifyOtp({ email, otp: otpValue });
            setSuccess("Email verified successfully! Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Invalid OTP. Please try again."
            );
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            setError("");
            await authApi.resendOtp({ email });
            setCountdown(60);
            setSuccess("OTP resent! Please check your email.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md flex flex-col gap-6">
                <Card className="border-red-100 shadow-sm">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                                <MailCheck className="w-6 h-6 text-red-600" strokeWidth={2} />
                            </div>
                        </div>
                        <CardTitle className="text-xl">Verify your email</CardTitle>
                        <CardDescription className="text-sm">
                            We sent a 6-digit OTP to{" "}
                            <span className="font-medium text-gray-700">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-5">

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={`w-11 h-12 text-center text-lg font-semibold border rounded-xl outline-none transition-all
                                        ${digit ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-900"}
                                        focus:border-red-500 focus:ring-2 focus:ring-red-100`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100 text-center">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100 text-center">
                                {success}
                            </p>
                        )}

                        <Button
                            onClick={handleVerify}
                            disabled={loading || otp.join("").length < 6}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-4 h-4 mr-2" strokeWidth={2.5} />
                                    Verify Email
                                </>
                            )}
                        </Button>

                        {/* Resend */}
                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Resend OTP in{" "}
                                    <span className="font-medium text-red-600">{countdown}s</span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1.5 mx-auto"
                                >
                                    {resending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    )}
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Wrong email?{" "}
                            <button
                                onClick={() => router.push("/register")}
                                className="text-red-600 font-medium hover:underline"
                            >
                                Go back
                            </button>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}