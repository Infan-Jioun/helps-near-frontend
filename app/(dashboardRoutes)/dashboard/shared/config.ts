import { EmergencyStatus } from "./types";

export const STATUS_STYLES: Record<EmergencyStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-sky-50 text-sky-700 border-sky-200",
    IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

export const STATUS_DOT: Record<EmergencyStatus, string> = {
    PENDING: "bg-amber-400",
    ACCEPTED: "bg-sky-500",
    IN_PROGRESS: "bg-orange-500 animate-pulse",
    RESOLVED: "bg-emerald-500",
    CANCELLED: "bg-gray-400",
};

export const STATUS_STRIPE: Record<EmergencyStatus, string> = {
    PENDING: "bg-amber-300",
    ACCEPTED: "bg-sky-400",
    IN_PROGRESS: "bg-orange-400",
    RESOLVED: "bg-emerald-400",
    CANCELLED: "bg-gray-300",
};

export const TYPE_EMOJI: Record<string, string> = {
    MEDICAL: "🚑",
    FIRE: "🔥",
    ACCIDENT: "💥",
    FLOOD: "🌊",
    CRIME: "🚨",
    OTHER: "⚠️",
};

export const TIP_AMOUNTS = [20, 50, 100, 200];