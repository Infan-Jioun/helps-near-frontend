"use client";

import { useState } from "react";
import { userApi } from "@/lib/userApi";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { RefreshCw, ServerCrash, Globe, ExternalLink } from "lucide-react";

type LogEntry = {
    timestamp: string;
    method: string;
    endpoint?: string;
    path?: string;
    statusCode?: number;
    responseTime?: string;
    ip: string;
    userAgent?: string;
    source: "backend" | "frontend";
};

type Props = {
    initialLogs: LogEntry[];
};

function MethodBadge({ method }: { method: string }) {
    const variants: Record<string, string> = {
        GET: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
        POST: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
        PUT: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
        PATCH: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
        DELETE: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
    };
    return (
        <Badge variant="outline" className={`font-mono text-[11px] font-semibold ${variants[method] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
            {method}
        </Badge>
    );
}

function StatusBadge({ code }: { code?: number }) {
    if (!code) return <span className="text-gray-300 text-xs">—</span>;
    const style =
        code >= 500 ? "bg-red-50 text-red-600 border-red-200" :
            code >= 400 ? "bg-orange-50 text-orange-600 border-orange-200" :
                code >= 300 ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                    "bg-emerald-50 text-emerald-600 border-emerald-200";
    return (
        <Badge variant="outline" className={`font-mono font-bold text-xs ${style}`}>
            {code}
        </Badge>
    );
}

function SourceBadge({ source }: { source: "backend" | "frontend" }) {
    return source === "backend" ? (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1 text-[11px]">
            <ServerCrash className="w-3 h-3" />
            backend
        </Badge>
    ) : (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 gap-1 text-[11px]">
            <Globe className="w-3 h-3" />
            frontend
        </Badge>
    );
}


function EndpointLink({ log }: { log: LogEntry }) {
    const displayPath = log.endpoint ?? log.path ?? null;

    if (!displayPath || displayPath === "—") {
        return <span className="text-gray-300">—</span>;
    }

    // backend → BACKEND_URL + endpoint
    // frontend → same origin + path
    const href =
        log.source === "backend"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${displayPath}`
            : displayPath; // Next.js route — relative link

    return (

        <a href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 group max-w-[220px] truncate text-gray-700 hover:text-red-600 transition-colors"
        >
            <span className="truncate font-mono text-xs">{displayPath}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400" />
        </a >
    );
}

function SkeletonRows() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-red-100">
                    <TableCell><Skeleton className="h-3 w-36 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-14 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-48 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-16 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-28 bg-red-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 bg-red-100" /></TableCell>
                </TableRow>
            ))}
        </>
    );
}

const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];
const SOURCES = ["ALL", "backend", "frontend"];

export default function AllLogs({ initialLogs }: Props) {
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [loading, setLoading] = useState(false);
    const [methodFilter, setMethodFilter] = useState("ALL");
    const [sourceFilter, setSourceFilter] = useState("ALL");

    const refetch = async () => {
        setLoading(true);
        try {
            const res = await userApi.getAllLogs(); 
            const merged = (res?.data ?? []).sort(
                (a: LogEntry, b: LogEntry) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setLogs(merged);
        } catch (err) {
            console.error("Refetch failed:", err);
        } finally {
            setLoading(false);
        }
    };
    const filtered = logs.filter((l) => {
        const methodMatch = methodFilter === "ALL" || l.method === methodFilter;
        const sourceMatch = sourceFilter === "ALL" || (l.source ?? "backend") === sourceFilter;
        return methodMatch && sourceMatch;
    });

    return (
        <div className="p-6 space-y-4">
            <Card className="border-red-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-red-600 text-xl font-bold tracking-tight">
                                Access Logs
                            </CardTitle>
                            <CardDescription className="text-red-400 text-xs mt-0.5">
                                {filtered.length} entries found
                            </CardDescription>
                        </div>
                        <Button
                            onClick={refetch}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-400"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} />
                            {loading ? "Refreshing..." : "Refresh"}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400 self-center mr-1">Method:</span>
                        {METHODS.map((m) => (
                            <Button
                                key={m} size="sm"
                                variant={methodFilter === m ? "default" : "outline"}
                                onClick={() => setMethodFilter(m)}
                                className={`h-7 px-3 text-xs font-mono ${methodFilter === m
                                    ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                    : "border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                                    }`}
                            >
                                {m}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400 self-center mr-1">Source:</span>
                        {SOURCES.map((s) => (
                            <Button
                                key={s} size="sm"
                                variant={sourceFilter === s ? "default" : "outline"}
                                onClick={() => setSourceFilter(s)}
                                className={`h-7 px-3 text-xs font-mono ${sourceFilter === s
                                    ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                    : "border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                                    }`}
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-red-50 border-red-200 hover:bg-red-50">
                            {["Timestamp", "Method", "Endpoint / Path", "Status", "Time", "IP", "Source"].map((h) => (
                                <TableHead key={h} className="text-red-500 text-[11px] uppercase tracking-widest font-semibold">
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading && <SkeletonRows />}

                        {!loading && filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-red-300 text-sm">
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && filtered.map((log, i) => (
                            <TableRow key={i} className="border-red-50 hover:bg-red-50/50 transition-colors">
                                <TableCell className="text-gray-400 text-xs whitespace-nowrap font-mono">
                                    {log.timestamp && !isNaN(new Date(log.timestamp).getTime())
                                        ? new Date(log.timestamp).toLocaleString()
                                        : <span className="text-gray-300">—</span>
                                    }
                                </TableCell>
                                <TableCell>
                                    <MethodBadge method={log.method} />
                                </TableCell>
                                {/* ✅ Clickable link */}
                                <TableCell>
                                    <EndpointLink log={log} />
                                </TableCell>
                                <TableCell>
                                    <StatusBadge code={log.statusCode} />
                                </TableCell>
                                <TableCell className="text-red-400 text-xs font-mono whitespace-nowrap">
                                    {log.responseTime ?? "—"}
                                </TableCell>
                                <TableCell className="text-gray-400 text-xs font-mono whitespace-nowrap min-w-[120px]">
                                    {log.ip ?? "—"}
                                </TableCell>
                                <TableCell>
                                    <SourceBadge source={log.source} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}