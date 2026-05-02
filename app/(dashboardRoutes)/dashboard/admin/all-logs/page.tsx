import { cookies } from "next/headers";
import AllLogs from "./components/AllLogs";

async function fetchWithAuth(url: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString(); 

    const res = await fetch(url, {
        cache: "no-store",
        headers: {
            Cookie: cookieHeader,
        },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
}

export default async function AllLogsPage() {
    const [backendLogs, frontendLogs] = await Promise.all([
        fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/backend-logs`),
        fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/frontend-logs`),
    ]);

    const logs = [...backendLogs, ...frontendLogs].sort(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return <AllLogs initialLogs={logs} />;
}