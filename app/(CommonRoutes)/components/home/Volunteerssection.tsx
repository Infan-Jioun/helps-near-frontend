import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, CheckCircle, ArrowRight } from "lucide-react";

interface Volunteer {
    id: string;
    name: string;
    email: string;
    isAvailable: boolean;
    volunteerProfile: {
        skills: string[];
        averageRating: number;
        totalHelped: number;
        isVerified: boolean;
        bio: string | null;
    };
}

async function getTopVolunteers(): Promise<Volunteer[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/volunteer?limit=3&page=1`,
            { cache: "no-store" }
        );
        const data = await res.json();
        return data?.data || [];
    } catch {
        return [];
    }
}
export default async function VolunteersSection() {
    const volunteers = await getTopVolunteers();

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                    <div>
                        <Badge className="mb-4 bg-red-50 text-red-600 border-red-100">
                            Our Heroes
                        </Badge>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Meet Our Top Volunteers
                        </h2>
                        <p className="text-gray-500 max-w-xl">
                            Dedicated individuals who give their time to help others in need.
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 gap-2" asChild>
                        <Link href="/volunteers">
                            View All Volunteers
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {volunteers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No volunteers found. Be the first to join!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {volunteers.map((v) => (
                            <div key={v.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg font-bold">
                                            {v.name?.charAt(0) || "V"}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{v.name}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                {v.volunteerProfile?.isVerified && (
                                                    <><CheckCircle className="w-3 h-3 text-green-500" /> Verified</>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${v.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {v.isAvailable ? "Available" : "Busy"}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {v.volunteerProfile?.bio || "Dedicated volunteer ready to help."}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {v.volunteerProfile?.skills?.slice(0, 3).map((skill) => (
                                        <span key={skill} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                            {skill.replace("_", " ")}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span className="font-medium text-gray-700">
                                            {v.volunteerProfile?.averageRating?.toFixed(1) || "0.0"}
                                        </span>
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        {v.volunteerProfile?.totalHelped || 0} helped
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}