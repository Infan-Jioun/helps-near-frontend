/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Menu,
    X,
    AlertTriangle,
    Users,
    Heart,
    Phone,
    ChevronDown,
    LogOut,
    User,
    LayoutDashboard,
    Bell,
    Home,
} from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import Logo from "@/components/logo/logo";

const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Emergencies", href: "/emergency", icon: AlertTriangle },
    { label: "Volunteers", href: "/volunteers", icon: Users },
    { label: "How It Works", href: "/how-it-works", icon: Heart },
    { label: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isPending, setIsPending] = useState(true);


    useEffect(() => {
        axiosInstance
            .get("/api/v1/auth/me")
            .then((res) => setUser(res.data?.data || null))
            .catch(() => setUser(null))
            .finally(() => setIsPending(false));
    }, [pathname]); 

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/api/v1/auth/logout");
        } catch {
        } finally {
            setUser(null);
            router.push("/login");
            router.refresh();
        }
    };

    const dashboardRoute =
        user?.role === "ADMIN"
            ? "/dashboard/admin"
            : user?.role === "VOLUNTEER"
                ? "/dashboard/volunteer"
                : "/dashboard/user";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-red-100"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8">
                            <Logo />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-gray-900 text-base">
                                Helps<span className="text-red-600">Near</span>
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase">Emergency Help</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                        ? "bg-red-50 text-red-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
                        ) : user ? (
                            <>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-red-600 text-white flex items-center justify-center p-0">
                                        3
                                    </Badge>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-colors">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user?.profileImage || ""} />
                                                <AvatarFallback className="bg-red-100 text-red-600 font-semibold text-sm">
                                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {user?.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400 uppercase">
                                                    {user?.role}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={dashboardRoute} className="flex items-center gap-2">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2" asChild>
                                    <Link href="/register">
                                        <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                                        Get Help
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                {mobileOpen ? <X /> : <Menu />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-0">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                                    <div className="w-8 h-8">
                                        <Logo />
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        Helps<span className="text-red-600">Near</span>
                                    </span>
                                </div>

                                {user && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
                                        <Avatar className="w-9 h-9">
                                            <AvatarFallback className="bg-red-100 text-red-600 font-bold text-sm">
                                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                )}

                                <nav className="flex flex-col p-4 gap-1 flex-1">
                                    {navLinks.map(({ label, href, icon: Icon }) => {
                                        const isActive = pathname === href;
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${isActive
                                                    ? "bg-red-50 text-red-600 font-medium"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </Link>
                                        );
                                    })}

                                    {user && (
                                        <>
                                            <div className="h-px bg-gray-100 my-2" />
                                            <Link
                                                href="/profile"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link
                                                href={dashboardRoute}
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </>
                                    )}
                                </nav>

                                <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
                                    {user ? (
                                        <Button
                                            variant="destructive"
                                            onClick={handleLogout}
                                            className="w-full gap-2 rounded-xl"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="w-full rounded-xl" asChild>
                                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                                    Sign In
                                                </Link>
                                            </Button>
                                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2" asChild>
                                                <Link href="/register" onClick={() => setMobileOpen(false)}>
                                                    <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                                                    Get Help
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Emergency Strip */}
            <div className="bg-red-600 text-white text-center text-xs py-1.5 font-medium">
                🚨 Emergency? Call{" "}
                <a href="tel:999" className="underline font-bold">
                    999
                </a>{" "}
                immediately
            </div>
        </header>
    );
}