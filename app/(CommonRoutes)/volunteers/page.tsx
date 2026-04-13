"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    ShieldCheck,
    Clock,
    Star,
    MapPin,
    Droplets,
    Users,
    ChevronLeft,
    ChevronRight,
    BanknoteIcon,
} from "lucide-react";
import { volunteerApi } from "@/lib/volunteerapi";

// ─── Types ───────────────────────────────────────────────────────────────────
interface VolunteerUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    isAvailable?: boolean;
    bloodGroup?: string;
    latitude?: number;
    longitude?: number;
    fee?: number;      // ✅ যোগ করা হয়েছে
    isFree?: boolean;  // ✅ যোগ করা হয়েছে
}

interface Volunteer {
    id: string;
    userId: string;
    bio?: string;
    skills: string[];
    isVerified: boolean;
    averageRating: number;
    totalHelped: number;
    fee?: number;      // ✅ optional করা হয়েছে
    isFree?: boolean;  // ✅ optional করা হয়েছে
    user: VolunteerUser;
}

// ✅ Fix: backend থেকে আসে totalPages (service-এ Math.ceil দিয়ে তৈরি)
// কিন্তু controller-এ totalPage নামে পাঠানো হয়।
// তাই দুটোই রাখা হয়েছে যাতে যেকোনো case handle হয়
interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;  // service থেকে সরাসরি
    totalPage?: number;   // controller থেকে rename করা
}

interface VolunteerParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    isVerified?: boolean;
    isAvailable?: boolean;
    isFree?: boolean;
}

// ─── Helper: meta থেকে totalPages বের করা ────────────────────────────────
function getTotalPages(meta: Meta): number {
    return meta.totalPages ?? meta.totalPage ?? 1;
}

// ─── Helper: Smart Pagination with dots ──────────────────────────────────
function getPaginationPages(currentPage: number, totalPages: number): (number | "...")[] {
    const delta = 2;
    const range: number[] = [];
    const result: (number | "...")[] = [];

    for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
    ) {
        range.push(i);
    }

    if (currentPage - delta > 2) result.push(1, "...");
    else result.push(1);

    result.push(...range);

    if (currentPage + delta < totalPages - 1) result.push("...", totalPages);
    else if (totalPages > 1) result.push(totalPages);

    return result;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function VolunteerCardSkeleton() {
    return (
        <Card className="border-red-100 bg-white overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="flex gap-1.5 flex-wrap">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-7 w-24 rounded-full" />
            </CardFooter>
        </Card>
    );
}

// ─── Card ────────────────────────────────────────────────────────────────────
function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
    const { user, skills, isVerified, averageRating, totalHelped, bio } = volunteer;

    // ✅ fee ও isFree — volunteer object থেকে নাও, না থাকলে user থেকে fallback
    const fee = volunteer.fee ?? user.fee ?? 0;
    const isFree = volunteer.isFree ?? user.isFree ?? false;

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <Card className="group border-red-100 bg-white hover:border-red-300 hover:shadow-lg hover:shadow-red-50 transition-all duration-300 overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${isVerified
                ? "bg-gradient-to-r from-red-500 to-rose-400"
                : "bg-gradient-to-r from-amber-400 to-orange-300"
                }`} />

            <CardHeader className="pb-2 pt-5">
                <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                        <Avatar className="h-14 w-14 rounded-2xl border-2 border-red-50 ring-2 ring-transparent group-hover:ring-red-100 transition-all">
                            <AvatarImage src={user.profileImage ?? ""} alt={user.name} />
                            <AvatarFallback className="rounded-2xl bg-red-600 text-white text-sm font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${user.isAvailable ? "bg-emerald-400" : "bg-slate-300"
                            }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                            {isVerified && <ShieldCheck className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                        {user.phone && (
                            <p className="text-xs text-slate-400 truncate">{user.phone}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {Number(averageRating) > 0 && (
                                <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {Number(averageRating).toFixed(1)}
                                </span>
                            )}
                            {user.bloodGroup && (
                                <span className="flex items-center gap-0.5 text-xs text-red-500 font-semibold">
                                    <Droplets className="h-3 w-3" />
                                    {user.bloodGroup.replace(/_/g, " ")}
                                </span>
                            )}
                            {user.latitude && user.longitude && (
                                <span className="flex items-center gap-0.5 text-xs text-slate-400">
                                    <MapPin className="h-3 w-3" /> Located
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {bio && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{bio}</p>
                )}
            </CardHeader>

            {skills.length > 0 && (
                <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 4).map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="text-[10px] px-2 py-0 h-5 bg-red-50 text-red-700 border-red-100 font-medium rounded-full"
                            >
                                {skill.replace(/_/g, " ")}
                            </Badge>
                        ))}
                        {skills.length > 4 && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] px-2 py-0 h-5 bg-slate-100 text-slate-500 rounded-full font-medium"
                            >
                                +{skills.length - 4}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            )}

            <CardFooter className="pt-2 pb-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border-0 ${isVerified
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                            }`}>
                            {isVerified ? (
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Pending
                                </span>
                            )}
                        </Badge>

                        {/* ✅ isFree সঠিকভাবে কাজ করবে এখন */}
                        {isFree ? (
                            <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full font-semibold border border-green-100">
                                <BanknoteIcon className="h-3 w-3" />
                                Free
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
                                <BanknoteIcon className="h-3 w-3" />
                                ৳{fee.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                            {totalHelped ?? 0} helped
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-medium ${user.isAvailable ? "text-emerald-500" : "text-slate-400"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${user.isAvailable ? "bg-emerald-400" : "bg-slate-300"
                                }`} />
                            {user.isAvailable || "Available"}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Volunteers() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isVerified, setIsVerified] = useState("all");
    const [isAvailable, setIsAvailable] = useState("all");
    const [isFree, setIsFree] = useState("all");
    const [page, setPage] = useState(1);
    const LIMIT = 12;

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => { setPage(1); }, [debouncedSearch, isVerified, isAvailable, isFree]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: VolunteerParams = { page, limit: LIMIT };
            if (debouncedSearch) params.searchTerm = debouncedSearch;
            if (isVerified !== "all") params.isVerified = isVerified === "true";
            if (isAvailable !== "all") params.isAvailable = isAvailable === "true";
            if (isFree !== "all") params.isFree = isFree === "true";

            const res = await volunteerApi.getAllVolunteers(params);
            setVolunteers(res.data ?? []);
            setMeta(res.meta ?? null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, isVerified, isAvailable, isFree]);

    useEffect(() => { load(); }, [load]);

    const totalPages = meta ? getTotalPages(meta) : 1;

    return (
        <div className="mt-28 min-h-screen bg-gradient-to-br from-red-50/40 via-white to-rose-50/20">

            <div className="bg-white border-b border-red-100 sticky top-0 z-10 shadow-sm shadow-red-50/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-200">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                                    Volunteers
                                </h1>
                                <p className="text-xs text-slate-400">
                                    {meta ? `${meta.total} total registered` : "Loading…"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                <Input
                                    placeholder="Search volunteers…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9 text-sm w-52 border-red-100 focus-visible:ring-red-400 bg-red-50/40 placeholder:text-slate-400"
                                />
                            </div>

                            <Select value={isVerified} onValueChange={setIsVerified}>
                                <SelectTrigger className="h-9 w-32 text-xs border-red-100 bg-red-50/40 focus:ring-red-400">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="true">Verified</SelectItem>
                                    <SelectItem value="false">Pending</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={isAvailable} onValueChange={setIsAvailable}>
                                <SelectTrigger className="h-9 w-36 text-xs border-red-100 bg-red-50/40 focus:ring-red-400">
                                    <SelectValue placeholder="Availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Available</SelectItem>
                                    <SelectItem value="false">Busy</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={isFree} onValueChange={setIsFree}>
                                <SelectTrigger className="h-9 w-32 text-xs border-red-100 bg-red-50/40 focus:ring-red-400">
                                    <SelectValue placeholder="Fee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Fee</SelectItem>
                                    <SelectItem value="true">Free</SelectItem>
                                    <SelectItem value="false">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3">
                        <span><span className="font-semibold">Error:</span> {error}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={load}
                            className="ml-auto text-red-600 hover:bg-red-100 h-7 text-xs"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: LIMIT }).map((_, i) => <VolunteerCardSkeleton key={i} />)
                        : volunteers.length === 0
                            ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                        <Users className="h-8 w-8 text-red-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No volunteers found</p>
                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                                </div>
                            )
                            : volunteers.map((v) => <VolunteerCard key={v.id} volunteer={v} />)
                    }
                </div>

                {/* ✅ Fix: totalPages এখন getTotalPages() দিয়ে নেওয়া হচ্ছে */}
                {meta && totalPages > 1 && (
                    <>
                        <Separator className="my-6 bg-red-50" />
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400">
                                Page <span className="font-semibold text-slate-600">{meta.page}</span> of{" "}
                                <span className="font-semibold text-slate-600">{totalPages}</span>
                                {" "}— {meta.total} volunteers
                            </p>

                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="h-8 w-8 p-0 border-red-100 hover:bg-red-50 hover:border-red-300 disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4 text-red-500" />
                                </Button>

                                {/* ✅ Fix: Smart pagination — current page > 5 হলেও কাজ করবে */}
                                {getPaginationPages(page, totalPages).map((p, idx) =>
                                    p === "..." ? (
                                        <span
                                            key={`dots-${idx}`}
                                            className="text-xs text-slate-400 px-1"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <Button
                                            key={p}
                                            variant={page === p ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPage(p as number)}
                                            className={`h-8 w-8 p-0 text-xs font-semibold ${page === p
                                                ? "bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-sm shadow-red-200"
                                                : "border-red-100 hover:bg-red-50 text-slate-600"
                                                }`}
                                        >
                                            {p}
                                        </Button>
                                    )
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="h-8 w-8 p-0 border-red-100 hover:bg-red-50 hover:border-red-300 disabled:opacity-40"
                                >
                                    <ChevronRight className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}