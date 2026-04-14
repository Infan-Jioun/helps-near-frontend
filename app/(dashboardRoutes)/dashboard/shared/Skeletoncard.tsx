// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-0.5 bg-red-100" />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-6 rounded bg-red-50" />
                        <div className="h-6 w-24 rounded-full bg-red-100" />
                        <div className="h-6 w-16 rounded-full bg-red-50" />
                    </div>
                    <div className="h-4 w-20 rounded bg-gray-100" />
                </div>
                <div className="space-y-2 mb-3">
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-4/5 rounded bg-gray-100" />
                </div>
                <div className="h-3 w-40 rounded bg-red-50 mb-4" />
                <div className="border-t border-red-50 pt-4 flex justify-between">
                    <div className="h-3 w-28 rounded bg-gray-100" />
                    <div className="flex gap-2">
                        <div className="h-7 w-20 rounded-lg bg-blue-50" />
                        <div className="h-7 w-20 rounded-lg bg-red-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}