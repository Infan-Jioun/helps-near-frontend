import AllLogs from "./components/AllLogs";

async function getLogs() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/logs`,
            { cache: "no-store" }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data ?? [];
    } catch {
        return [];
    }
}

export default async function AllLogsPage() {
    const logs = await getLogs();
    return <AllLogs initialLogs={logs} />;
}