import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
                            <ShieldX className="w-12 h-12 text-red-600" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            !
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl font-black text-red-600 mb-2 leading-none">403</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    You don&apos;t have permission to access this page.
                    Please contact an admin if you think this is a mistake.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 rounded-xl px-6" asChild>
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-xl px-6" asChild>
                        <Link href="/login">
                            <ArrowLeft className="w-4 h-4" />
                            Login
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}