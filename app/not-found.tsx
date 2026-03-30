import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";


export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">

                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-600" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            !
                        </div>
                    </div>
                </div>

                <h1 className="text-8xl font-black text-red-600 mb-2 leading-none">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    The page you are looking for does not exist or has been moved.
                    Don&apos;t worry — help is always near.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white gap-2 rounded-xl px-6"
                        asChild
                    >
                      
                    </Button>
                   
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">
                        Having an emergency?{" "}
                        <a href="tel:999" className="font-bold underline underline-offset-2">Call 999</a>{" "}
                        or{" "}
                        <Link href="/" className="font-bold underline underline-offset-2">
                           Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}