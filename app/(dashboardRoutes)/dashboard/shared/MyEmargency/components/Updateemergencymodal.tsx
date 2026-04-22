/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { emergencyApi } from "@/lib/emergencyApi";
import { useState } from "react";

type EmergencyStatus =
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED";

interface Emergency {
    id: string;
    status: EmergencyStatus;
    description: string;
    address: string;
    district: string;
    isPriority: boolean;
}

interface UpdateEmergencyModalProps {
    emergency: Emergency;
    onClose: () => void;
    onSuccess: () => void;
}

const STATUS_OPTIONS: EmergencyStatus[] = [
    "PENDING",
    "ACCEPTED",
    "IN_PROGRESS",
    "RESOLVED",
    "CANCELLED",
];

const STATUS_COLORS: Record<EmergencyStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
    IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-300",
    RESOLVED: "bg-green-100 text-green-800 border-green-300",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function UpdateEmergencyModal({
    emergency,
    onClose,
    onSuccess,
}: UpdateEmergencyModalProps) {
    const [form, setForm] = useState({
        status: emergency.status,
        description: emergency.description,
        address: emergency.address,
        district: emergency.district,
        isPriority: emergency.isPriority,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await emergencyApi.update(emergency.id, form);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update emergency.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-red-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-white text-xl font-bold tracking-tight">
                                Update Emergency
                            </h2>
                            <p className="text-blue-100 text-sm mt-0.5">
                                ID: {emergency.id.slice(0, 8)}...
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                            <svg
                                className="w-5 h-5 shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                        <span
                            className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[form.status]}`}
                        >
                            {form.status.replace("_", " ")}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none transition"
                            placeholder="Describe the emergency..."
                        />
                    </div>

                    {/* Address & District */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                                placeholder="Street address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                District
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                                placeholder="District"
                            />
                        </div>
                    </div>

                    {/* Priority Toggle */}
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Mark as Priority
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Priority emergencies get faster response
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPriority"
                                checked={form.isPriority}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}