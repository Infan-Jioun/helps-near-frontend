import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-20 bg-red-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Make a Difference?
                </h2>
                <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
                    Join our community of volunteers and help save lives in your area.
                    Every second counts in an emergency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        className="bg-white text-red-600 hover:bg-red-50 px-8 py-6 text-lg rounded-xl gap-2"
                        asChild
                    >
                        <Link href="/register">
                            <Heart className="w-5 h-5" />
                            Join as Volunteer
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-red-700 px-8 py-6 text-lg rounded-xl gap-2"
                        asChild
                    >
                        <Link href="/emergency">
                            View Emergencies
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-red-100 text-sm flex-wrap">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Free to join</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Verified process</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />24/7 support</div>
                </div>
            </div>
        </section>
    );
}