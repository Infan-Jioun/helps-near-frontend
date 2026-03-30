import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Shield, Heart, Clock, Award } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Instant Response",
        description: "Report an emergency and get connected with nearby volunteers within minutes.",
        color: "bg-red-50 text-red-600",
    },
    {
        icon: MapPin,
        title: "Location Based",
        description: "Our system automatically finds the closest verified volunteers to your location.",
        color: "bg-orange-50 text-orange-600",
    },
    {
        icon: Shield,
        title: "Verified Volunteers",
        description: "Every volunteer is verified by our admin team before they can respond to emergencies.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Heart,
        title: "Community Driven",
        description: "Built on the belief that people help people. Your community is always there for you.",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: Clock,
        title: "Real-time Tracking",
        description: "Track your volunteer's estimated arrival time and current status in real time.",
        color: "bg-purple-50 text-purple-600",
    },
    {
        icon: Award,
        title: "Priority Support",
        description: "Mark your emergency as priority to get faster response from available volunteers.",
        color: "bg-yellow-50 text-yellow-600",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <Badge className="mb-4 bg-red-50 text-red-600 border-red-100">
                        Why Choose Us
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Built for Real Emergencies
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Every feature is designed with one goal — getting you help as fast as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map(({ icon: Icon, title, description, color }) => (
                        <div
                            key={title}
                            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}