import {
    HeartPulse,
    Flame,
    Car,
    Waves,
    Siren,
    AlertTriangle,
} from "lucide-react";

const emergencyTypes = [
    {
        label: "Medical",
        icon: HeartPulse,
    },
    {
        label: "Fire",
        icon: Flame,
    },
    {
        label: "Accident",
        icon: Car,
    },
    {
        label: "Flood",
        icon: Waves,
    },
    {
        label: "Crime",
        icon: Siren,
    },
    {
        label: "Other",
        icon: AlertTriangle,
    },
];

export default function EmergencyTypesSection() {
    return (
        <section className="py-16 bg-red-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-red-700 mb-3">
                        Emergency Support Categories
                    </h2>
                    <p className="text-red-500">
                        Fast response for every critical situation
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                    {emergencyTypes.map(({ label, icon: Icon }) => (
                        <div
                            key={label}
                            className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-red-200 bg-white shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                        >
                            {/* Icon */}
                            <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-200 transition">
                                <Icon
                                    size={32}
                                    className="text-red-600 group-hover:scale-110 transition-transform duration-200"
                                />
                            </div>

                            {/* Label */}
                            <span className="text-sm font-semibold text-red-700">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}