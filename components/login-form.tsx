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
import { Eye, EyeOff, Loader2, CircleAlert } from "lucide-react";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Logo from "./logo/logo";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = (email: string, password: string): string => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const validationError = validateForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/v1/auth/login", {
        email,
        password,
      });

      const data = res.data?.data;
      const emailVerified = data?.user?.emailVerified;
      const role = data?.user?.role;

      if (!emailVerified) {
        toast.info("Please verify your email to continue.");
        router.push(`/verify-email`);
        return;
      }


      toast.success("Logged in successfully!");

      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "VOLUNTEER") {
        router.push("/dashboard/volunteer");
      } else {
        router.push("/dashboard/user");
      }

    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "";

      if (status === 401) {
        setError("Invalid email or password.");
      } else if (
        message.toLowerCase().includes("verify") ||
        message.toLowerCase().includes("not verified")
      ) {
        setError("Please verify your email before logging in.");
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (status === 403) {
        setError("Your account has been blocked. Please contact support.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-red-100 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Helps Near account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Provide your password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-9"
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

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white mt-1"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-red-600">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-red-600">Privacy Policy</a>.
      </p>
    </div>
  );
}