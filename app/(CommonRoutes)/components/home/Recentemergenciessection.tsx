import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, MapPin, Clock, ArrowRight } from "lucide-react";

interface Emergency {
    id: string;
    type: string;
    description: string | null;
    address: string | null;
    district: string | null;
    status: string;
    isPriority: boolean;
    createdAt: string;
    user: {
        name: string;
    };
}

const typeColors: Record<string, string> = {
    MEDICAL: "bg-red-100 text-red-700",
    FIRE: "bg-orange-100 text-orange-700",
    ACCIDENT: "bg-yellow-100 text-yellow-700",
    FLOOD: "bg-blue-100 text-blue-700",
    CRIME: "bg-purple-100 text-purple-700",
    OTHER: "bg-gray-100 text-gray-700",
};

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    RESOLVED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-100 text-gray-500",
};

async function getRecentEmergencies(): Promise<Emergency[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/emergency?limit=3&page=1`,
            { cache: "no-store" }
        );
        const data = await res.json();
        return data?.data || [];
    } catch {
        return [];
    }
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default async function RecentEmergenciesSection() {
    const emergencies = await getRecentEmergencies();

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                    <div>
                        <Badge className="mb-4 bg-red-50 text-red-600 border-red-100">
                            Live Updates
                        </Badge>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Recent Emergencies
                        </h2>
                        <p className="text-gray-500">
                            Real-time emergency reports from your community.
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 gap-2" asChild>
                        <Link href="/emergency">
                            View All Emergencies
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {emergencies.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No emergencies found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {emergencies.map((e) => (
                            <Link key={e.id} href={`/emergency/${e.id}`}>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[e.type] || "bg-gray-100 text-gray-700"}`}>
                                                {e.type}
                                            </span>
                                            {e.isPriority && (
                                                <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-600 text-white">
                                                    Priority
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[e.status] || "bg-gray-100 text-gray-500"}`}>
                                            {e.status.replace("_", " ")}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
                                        {e.description || "Emergency reported"}
                                    </p>

                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {e.address || e.district || "Location not specified"}
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            {e.user?.name || "Anonymous"}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {timeAgo(e.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}