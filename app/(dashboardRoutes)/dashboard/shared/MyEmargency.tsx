"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { emergencyApi } from "@/lib/emergencyApi";

export default function MyEmargency() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId") || "";
                const res = await emergencyApi.getById(userId);
                setData(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <h1 className="text-xl font-bold">My Emergencies</h1>

            {data?.length === 0 ? (
                <p>No emergencies found</p>
            ) : (
                data.map((item) => (
                    <Link
                        key={item.id}
                        href={`/dashboard/user/my-emargencies/${item.id}`}
                        className="block border p-4 rounded-xl hover:bg-gray-50"
                    >
                        <p className="font-semibold">{item.type}</p>
                        <p className="text-sm text-gray-500">
                            {item.description || "No description"}
                        </p>
                    </Link>
                ))
            )}
        </div>
    );
}