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
    Home,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/logo/logo";

const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Emergencies", href: "/emergency", icon: AlertTriangle },
    { label: "Volunteers", href: "/volunteers", icon: Users },
    { label: "How It Works", href: "/how-it-works", icon: Heart },
    { label: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Session hook

    const { data: session, isPending } = authClient.useSession();
   console.log(session)
    const handleLogout = async () => {
        await authClient.signOut();
        window.location.reload();
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-red-100" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8"><Logo /></div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-gray-900 text-base">Helps<span className="text-red-600">Near</span></span>
                            <span className="text-[10px] text-gray-400 uppercase">Emergency Help</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm ${isActive ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"}`}>
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
                        ) : session?.user ? (
                            <>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-red-600 text-white flex items-center justify-center">3</Badge>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-xl">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={session.user.image || ""} />
                                                <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{session.user.name}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild><Link href="/profile"><User className="w-4 h-4 mr-2" />Profile</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Link></DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" />Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" asChild><Link href="/login">Sign In</Link></Button>
                                <Button className="bg-red-600 text-white" asChild><Link href="/register">Get Help</Link></Button>
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
                        <SheetContent side="right" className="w-[280px] p-0">
                            <div className="flex flex-col h-full">
                                <nav className="flex flex-col p-4 gap-2 flex-1">
                                    {navLinks.map(({ label, href, icon: Icon }) => (
                                        <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                                            <Icon className="w-5 h-5" /> {label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="p-4 border-t flex flex-col gap-3">
                                    {session?.user ? (
                                        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                                    ) : (
                                        <>
                                            <Button asChild><Link href="/login">Sign In</Link></Button>
                                            <Button className="bg-red-600" asChild><Link href="/register">Get Help</Link></Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Emergency Strip */}
            <div className="bg-red-600 text-white text-center text-xs py-1 font-medium">
                🚨 Emergency? Call <a href="tel:999" className="underline">999</a>
            </div>
        </header>
    );
}