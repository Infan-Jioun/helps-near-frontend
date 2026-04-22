/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { emergencyApi } from "@/lib/emergencyApi";
import { useState } from "react";

interface DeleteEmergencyModalProps {
    emergencyId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteEmergencyModal({
    emergencyId,
    onClose,
    onSuccess,
}: DeleteEmergencyModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await emergencyApi.delete(emergencyId);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Failed to delete emergency."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Icon Header */}
                <div className="flex flex-col items-center pt-8 pb-4 px-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 text-center">
                        Delete Emergency
                    </h2>
                    <p className="text-gray-500 text-sm text-center mt-2 leading-relaxed">
                        Are you sure you want to delete this emergency report?
                        <br />
                        <span className="font-medium text-gray-700">
                            This action cannot be undone.
                        </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-3 font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                        ID: {emergencyId}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mb-2 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm">
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

                {/* Divider */}
                <div className="border-t border-gray-100 mx-6 mt-4" />

                {/* Actions */}
                <div className="flex gap-3 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Yes, Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}