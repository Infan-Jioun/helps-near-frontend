"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Eye, EyeOff, Loader2, CircleAlert, CircleCheck,
    Heart, Shield, User, Mail, Lock, CreditCard,
    FileText, MapPin, BanknoteIcon,
} from "lucide-react";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Logo from "@/components/logo/logo";
import { userApi } from "@/lib/userApi";
import { toast } from "sonner";

const skills = [
    { value: "FIRST_AID", label: "First Aid" },
    { value: "FIREFIGHTING", label: "Firefighting" },
    { value: "RESCUE", label: "Rescue" },
    { value: "MEDICAL", label: "Medical" },
    { value: "FLOOD_RESPONSE", label: "Flood Response" },
    { value: "GENERAL", label: "General" },
];

export default function VolunteerRegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isFree, setIsFree] = useState(false);

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const validateForm = (
        name: string,
        email: string,
        password: string,
        fee: string,
    ): string => {
        if (!name.trim()) return "Full name is required.";
        if (name.trim().length < 2) return "Name must be at least 2 characters.";
        if (!email.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
        if (!password) return "Password is required.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        // ✅ fee validation
        if (!isFree) {
            if (!fee) return "Service fee is required.";
            if (isNaN(Number(fee)) || Number(fee) < 0) return "Please enter a valid fee amount.";
        }
        return "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const nidNumber = (form.elements.namedItem("nidNumber") as HTMLInputElement).value;
        const bio = (form.elements.namedItem("bio") as HTMLTextAreaElement).value;
        const fee = (form.elements.namedItem("fee") as HTMLInputElement).value;

        const validationError = validateForm(name, email, password, fee);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const res = await userApi.createVolunteer({
                name,
                email,
                password,
                nidNumber: nidNumber || undefined,
                skills: selectedSkills,
                bio: bio || undefined,
                fee: isFree ? 0 : Number(fee),
                isFree,
            });
            if (res.data.success) {
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                toast.success("Account created successfully! Please check your email for OTP verification.");
                return;
            }
            setSuccess("Volunteer registered successfully! You can now login.");
            setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(email)}`), 2000);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                            <Logo />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Volunteer</h1>
                    <p className="text-gray-500">Join our community and help people in need</p>
                </div>

                <Card className="border-red-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-600" />
                            Volunteer Registration
                        </CardTitle>
                        <CardDescription>
                            Fill in your details to register as a volunteer. Admin will verify your profile.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Name + Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="name" className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        Full Name
                                    </Label>
                                    <Input id="name" name="name" type="text" placeholder="John Doe" required />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="email" className="flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                        Email
                                    </Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password" className="flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pr-9"
                                        placeholder="Min 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* NID */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nidNumber" className="flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                    NID Number
                                    
                                </Label>
                                <Input id="nidNumber" name="nidNumber" type="text" placeholder="1234567890" />
                            </div>

                            {/* ✅ Fee Section */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-1.5">
                                    <BanknoteIcon className="w-3.5 h-3.5 text-gray-400" />
                                    Service Fee
                                    <span className="text-xs text-red-500">*</span>
                                </Label>

                                {/* isFree Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsFree(!isFree)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${isFree ? "bg-red-600" : "bg-gray-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isFree ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {isFree ? (
                                            <span className="text-green-600 font-medium">I will serve for free ✓</span>
                                        ) : (
                                            "I charge a service fee"
                                        )}
                                    </span>
                                </div>

                                {/* Fee Input - isFree হলে hide */}
                                {!isFree && (
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                            ৳
                                        </span>
                                        <Input
                                            id="fee"
                                            name="fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="e.g. 500"
                                            className="pl-7"
                                            required={!isFree}
                                        />
                                    </div>
                                )}

                                <p className="text-xs text-gray-400">
                                    {isFree
                                        ? "You have chosen to volunteer without any charge."
                                        : "Enter the amount you charge per emergency response in BDT."}
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                                    Skills
                                    <span className="text-xs text-red-500">*</span>
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(({ value, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => toggleSkill(value)}
                                            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${selectedSkills.includes(value)
                                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {selectedSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {selectedSkills.map((s) => (
                                            <Badge key={s} className="bg-red-50 text-red-600 border-red-100 border text-xs">
                                                {skills.find((sk) => sk.value === s)?.label}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bio" className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                                    Bio
                                    <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                                </Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    placeholder="Tell us about yourself and your experience..."
                                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                                />
                            </div>

                            {/* Location Info */}
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Location Access</p>
                                    <p className="text-xs text-blue-600/80 mt-0.5">
                                        After registration, enable location access in your profile to receive nearby emergency alerts.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">
                                    <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 px-3 py-2.5 rounded-xl border border-green-100">
                                    <CircleCheck className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-5 text-base gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" />Registering...</>
                                ) : (
                                    <><Heart className="w-4 h-4" />Register as Volunteer</>
                                )}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already a volunteer?{" "}
                                <a href="/login" className="text-red-600 font-medium hover:underline">Sign in</a>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6 px-6">
                    By registering, you agree to our{" "}
                    <a href="#" className="underline hover:text-red-600">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-red-600">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}