import { Badge } from "@/components/ui/badge";

const steps = [
    {
        step: "01",
        title: "Report Emergency",
        description: "Create an emergency report with your location, type, and description.",
    },
    {
        step: "02",
        title: "Volunteers Notified",
        description: "Nearby verified volunteers are instantly notified about your emergency.",
    },
    {
        step: "03",
        title: "Help is on the Way",
        description: "A volunteer accepts your request and heads to your location immediately.",
    },
    {
        step: "04",
        title: "Emergency Resolved",
        description: "Volunteer helps you resolve the emergency. Optionally rate and thank them.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <Badge className="mb-4 bg-red-50 text-red-600 border-red-100">
                        Simple Process
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        How Helps Near Works
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Getting help during an emergency has never been easier.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map(({ step, title, description }, index) => (
                        <div key={step} className="relative">
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-red-100 z-0" />
                            )}
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-red-200">
                                    {step}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}