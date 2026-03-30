const emergencyTypes = [
    { label: "Medical", icon: "🏥", color: "bg-red-100 text-red-700 border-red-200" },
    { label: "Fire", icon: "🔥", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { label: "Accident", icon: "🚗", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { label: "Flood", icon: "🌊", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Crime", icon: "🚨", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { label: "Other", icon: "⚠️", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

export default function EmergencyTypesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        We Handle All Types of Emergencies
                    </h2>
                    <p className="text-gray-500">
                        Whatever the situation, our volunteers are trained to help.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {emergencyTypes.map(({ label, icon, color }) => (
                        <div
                            key={label}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${color} cursor-pointer hover:scale-105 transition-transform`}
                        >
                            <span className="text-3xl">{icon}</span>
                            <span className="text-sm font-semibold">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}