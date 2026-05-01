"use client";

import { useState } from "react";

type LogEntry = {
    timestamp: string;
    method: string;
    endpoint: string;
    statusCode: number;
    responseTime: string;
    ip: string;
    userAgent: string;
};

type Props = {
    initialLogs: LogEntry[];
};

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <tr className="border-b border-red-950/30">
            {[140, 60, 200, 55, 90, 100].map((w, i) => (
                <td key={i} className="px-4 py-3">
                    <div
                        className="h-3 rounded bg-red-950/40 animate-pulse"
                        style={{ width: w }}
                    />
                </td>
            ))}
        </tr>
    );
}

// ── Method Badge ──────────────────────────────────────────────────────────────
function MethodBadge({ method }: { method: string }) {
    const colors: Record<string, string> = {
        GET: "bg-blue-950 text-blue-300 border-blue-800",
        POST: "bg-emerald-950 text-emerald-300 border-emerald-800",
        PUT: "bg-yellow-950 text-yellow-300 border-yellow-800",
        PATCH: "bg-orange-950 text-orange-300 border-orange-800",
        DELETE: "bg-red-950 text-red-300 border-red-800",
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${colors[method] ?? "bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}
        >
            {method}
        </span>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ code }: { code: number }) {
    const color =
        code >= 500 ? "text-red-400" :
            code >= 400 ? "text-orange-400" :
                code >= 300 ? "text-yellow-400" :
                    "text-emerald-400";

    return <span className={`font-mono font-bold text-sm ${color}`}>{code}</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllLogs({ initialLogs }: Props) {
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>("ALL");

    // CSR refresh — manually refetch latest
    const refetch = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/v1/logs", { credentials: "include" });
            const data = await res.json();
            setLogs(data?.data ?? []);
        } catch {
            // silently fail — keep existing data
        } finally {
            setLoading(false);
        }
    };

    const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

    const filtered =
        filter === "ALL" ? logs : logs.filter((l) => l.method === filter);

    return (
        <div className="min-h-screen bg-[#0a0404] text-red-100 font-mono p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-red-400 tracking-tight">
                        Access Logs
                    </h1>
                    <p className="text-red-700 text-xs mt-0.5">
                        {filtered.length} entries
                    </p>
                </div>

                <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-red-900 bg-red-950/40 text-red-400 text-sm hover:bg-red-900/40 transition disabled:opacity-40"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Method Filter */}
            <div className="flex flex-wrap gap-2 mb-5">
                {methods.map((m) => (
                    <button
                        key={m}
                        onClick={() => setFilter(m)}
                        className={`px-3 py-1 rounded text-xs border transition font-mono ${filter === m
                                ? "bg-red-900 border-red-600 text-red-200"
                                : "bg-transparent border-red-950 text-red-700 hover:border-red-800 hover:text-red-500"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-red-950/60 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-red-950/60 bg-red-950/20">
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                Timestamp
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                Method
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                Endpoint
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                Time
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] text-red-600 uppercase tracking-widest">
                                IP
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Skeleton */}
                        {loading &&
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}

                        {/* Data */}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-red-800 text-sm"
                                >
                                    No logs found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            filtered.map((log, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-red-950/30 hover:bg-red-950/20 transition-colors"
                                >
                                    <td className="px-4 py-3 text-red-700 text-xs whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <MethodBadge method={log.method} />
                                    </td>
                                    <td className="px-4 py-3 text-red-300 text-xs max-w-[220px] truncate">
                                        {log.endpoint}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge code={log.statusCode} />
                                    </td>
                                    <td className="px-4 py-3 text-red-600 text-xs">
                                        {log.responseTime}
                                    </td>
                                    <td className="px-4 py-3 text-red-700 text-xs">
                                        {log.ip}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}