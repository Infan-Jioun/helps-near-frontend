"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navLinks = [
    { label: "Emergencies", href: "/emergency", icon: AlertTriangle },
    { label: "Volunteers", href: "/volunteers", icon: Users },
    { label: "How It Works", href: "/how-it-works", icon: Heart },
    { label: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // demo user — replace with real auth
    const user = null;

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
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors">
                                <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-gray-900 text-base tracking-tight">
                                Helps
                                <span className="text-red-600">Near</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                                Emergency Help
                            </span>
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
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                            ? "bg-red-50 text-red-600"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-600 text-white text-[10px]">
                                        3
                                    </Badge>
                                </Button>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1.5 transition-colors">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="/avatar.jpg" />
                                                <AvatarFallback className="bg-red-100 text-red-600 text-sm font-semibold">
                                                    RH
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-sm font-medium text-gray-900">Rahim</span>
                                                <span className="text-[11px] text-gray-400">USER</span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                My Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="flex items-center gap-2">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2"
                                    asChild
                                >
                                    <Link href="/register">
                                        <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                                        Get Help Now
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] p-0">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        Helps<span className="text-red-600">Near</span>
                                    </span>
                                </div>

                                <nav className="flex flex-col gap-1 p-4 flex-1">
                                    {navLinks.map(({ label, href, icon: Icon }) => {
                                        const isActive = pathname === href;
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                                        ? "bg-red-50 text-red-600"
                                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" strokeWidth={2} />
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2" asChild>
                                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                                            <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                                            Get Help Now
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Emergency Strip */}
            <div className="bg-red-600 text-white text-center py-1.5 text-xs font-medium tracking-wide">
                🚨 Emergency? Call{" "}
                <a href="tel:999" className="underline font-bold">
                    999
                </a>{" "}
                immediately or{" "}
                <Link href="/emergency/create" className="underline font-bold">
                    report here
                </Link>
            </div>
        </header>
    );
}