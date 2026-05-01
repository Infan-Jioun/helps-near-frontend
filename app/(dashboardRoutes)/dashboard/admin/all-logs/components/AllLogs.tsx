"use client";

import { useState } from "react";
import { userApi } from "@/lib/userApi";

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

function SkeletonRow() {
    return (
        <tr className="border-b border-red-100">
            {[140, 60, 200, 55, 90, 100].map((w, i) => (
                <td key={i} className="px-4 py-3">
                    <div
                        className="h-3 rounded bg-red-100 animate-pulse"
                        style={{ width: w }}
                    />
                </td>
            ))}
        </tr>
    );
}

function MethodBadge({ method }: { method: string }) {
    const colors: Record<string, string> = {
        GET: "bg-blue-50 text-blue-700 border-blue-200",
        POST: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PUT: "bg-yellow-50 text-yellow-700 border-yellow-200",
        PATCH: "bg-orange-50 text-orange-700 border-orange-200",
        DELETE: "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${colors[method] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
            {method}
        </span>
    );
}

function StatusBadge({ code }: { code: number }) {
    const color =
        code >= 500 ? "text-red-600" :
            code >= 400 ? "text-orange-500" :
                code >= 300 ? "text-yellow-600" :
                    "text-emerald-600";
    return <span className={`font-mono font-bold text-sm ${color}`}>{code}</span>;
}

export default function AllLogs({ initialLogs }: Props) {
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>("ALL");

    const refetch = async () => {
        setLoading(true);
        try {
            const result = await userApi.getAllLogs();
            setLogs(result?.data ?? []);
        } catch (err) {
            console.error("Refetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];
    const filtered = filter === "ALL" ? logs : logs.filter((l) => l.method === filter);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-mono p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-red-600 tracking-tight">
                        Access Logs
                    </h1>
                    <p className="text-red-400 text-xs mt-0.5">
                        {filtered.length} entries
                    </p>
                </div>

                <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-red-500 bg-white text-red-500 text-sm hover:bg-red-50 transition disabled:opacity-40"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                        viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2}
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
                                ? "bg-red-600 border-red-600 text-white"
                                : "bg-white border-red-200 text-red-400 hover:border-red-400 hover:text-red-600"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-red-200 overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-red-200 bg-red-50">
                            {["Timestamp", "Method", "Endpoint", "Status", "Time", "IP"].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] text-red-500 uppercase tracking-widest font-semibold">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Skeleton */}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}

                        {/* Empty */}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-red-300 text-sm">
                                    No logs found.
                                </td>
                            </tr>
                        )}

                        {/* Data */}
                        {!loading && filtered.map((log, i) => (
                            <tr
                                key={i}
                                className="border-b border-red-50 hover:bg-red-50/60 transition-colors"
                            >
                                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <MethodBadge method={log.method} />
                                </td>
                                <td className="px-4 py-3 text-gray-700 text-xs max-w-[220px] truncate">
                                    {log.endpoint}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge code={log.statusCode} />
                                </td>
                                <td className="px-4 py-3 text-red-400 text-xs">
                                    {log.responseTime}
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">
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