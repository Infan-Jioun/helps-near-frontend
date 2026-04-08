/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CircleAlert, CircleCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Logo from "./logo/logo";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { authApi } from "@/lib/authApi";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = (name: string, email: string, password: string, confirm: string): string => {
    if (!name.trim()) return "Full name is required.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";

    if (password !== confirm) return "Passwords do not match.";
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
    const confirm = (form.elements.namedItem("confirm-password") as HTMLInputElement).value;

    const validationError = validateForm(name, email, password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register({ name, email, password });
      if (res.data.success) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        toast.success("Account created successfully! Please check your email for OTP verification.");
        return;
      }



      setSuccess("Account created! Please check your email for OTP verification.");
      setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(email)}`), 2000);

    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "";
      if (status === 409 || message.toLowerCase().includes("already exists")) {
        setError("An account with this email already exists.");
      } else {
        setError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const signupWithGoogle = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-red-100 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Join Helps Near and make a difference</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" placeholder="Provide Your Password" type={showPassword ? "text" : "password"} required className="pr-9" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirm-password" name="confirm-password" placeholder="Confirm Your Password" type={showConfirm ? "text" : "password"} required className="pr-9" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Min 8 characters with at least one uppercase letter and one number.
            </p>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                <CircleCheck className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white mt-1">
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>) : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 font-medium hover:underline">Sign in</Link>
            </p>
            <Link href="/volunteer-register" className="underline font-bold text-center text-red-500 hover:text-red-600 ">Volunteer Registration</Link>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={signupWithGoogle}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.85-6.85C35.91 2.36 30.36 0 24 0 14.61 0 6.46 5.48 2.44 13.44l7.98 6.2C12.28 13.1 17.68 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.65c-.55 2.96-2.21 5.48-4.71 7.18l7.27 5.66C43.93 37.18 46.5 31.36 46.5 24.5z" />
                <path fill="#FBBC05" d="M10.42 28.64A14.5 14.5 0 0 1 9.5 24c0-1.61.28-3.17.92-4.64l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.44 10.84l7.98-6.2z" />
                <path fill="#34A853" d="M24 48c6.36 0 11.91-2.09 15.88-5.69l-7.27-5.66c-2.02 1.36-4.6 2.17-8.61 2.17-6.32 0-11.72-3.6-13.58-8.64l-7.98 6.2C6.46 42.52 14.61 48 24 48z" />
              </svg>
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        {" "}
        and <Link href="" className="underline hover:text-red-600">Privacy Policy</Link>.
      </p>
    </div>
  );
}