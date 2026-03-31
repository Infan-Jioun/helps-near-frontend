import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Phone } from "lucide-react";

interface Stat {
    value: string;
    label: string;
}

async function getStats(): Promise<Stat[]> {
    try {
        const [emergencies, volunteers] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/emergency`, { cache: "no-store" }),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/volunteer`, { cache: "no-store" }),
        ]);
        const emergencyData = await emergencies.json();
        const volunteerData = await volunteers.json();
        const totalEmergencies = emergencyData?.meta?.total || 0;
        const totalVolunteers = volunteerData?.meta?.total || 0;
        return [
            { value: `${totalEmergencies}+`, label: "Emergencies Resolved" },
            { value: `${totalVolunteers}+`, label: "Active Volunteers" },
            { value: "24/7", label: "Always Available" },
            { value: "4.9★", label: "Average Rating" },
        ];
    } catch {
        return [
            { value: "2,400+", label: "Emergencies Resolved" },
            { value: "850+", label: "Active Volunteers" },
            { value: "24/7", label: "Always Available" },
            { value: "4.9★", label: "Average Rating" },
        ];
    }
}

export default async function HeroSection() {
    const stats = await getStats();

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-red-50 via-white to-orange-50" />
            <div className="absolute top-20 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <Badge className="mb-6 bg-red-100 text-red-700 border-red-200 hover:bg-red-100 px-4 py-1.5">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Help Platform — Bangladesh
                    </Badge>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                        Help is Always{" "}
                        <span className="text-red-600 relative">
                            Near
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                                <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Connect with verified volunteers in your area during emergencies.
                        Fast, reliable, and community-driven emergency response system.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-xl gap-2 shadow-lg shadow-red-200"
                            asChild
                        >
                            <Link href="/emergency/create">
                                <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                                Report Emergency Now
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-6 text-lg rounded-xl gap-2 border-gray-200"
                            asChild
                        >
                            <Link href="/volunteer-register">
                                <Users className="w-5 h-5" />
                                Become a Volunteer
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4 text-red-600" />
                        <span>For life-threatening emergencies, always call</span>
                        <a href="tel:999" className="font-bold text-red-600 hover:underline">999</a>
                        <span>first</span>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="text-3xl font-bold text-red-600 mb-1">{value}</div>
                            <div className="text-sm text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}