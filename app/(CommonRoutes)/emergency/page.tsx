/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight} from "lucide-react";
import { emergencyApi } from "@/lib/emergencyApi";
import { Flame, Car, Waves, CircleHelp, ShieldAlert, Stethoscope } from "lucide-react";
import EmergencyCard from "./components/EmergencyCard";
import EmergencyFilters from "./components/EmergencyFilters";

const typeConfig = {
  MEDICAL: { label: "Medical", icon: Stethoscope, color: "text-red-600", bg: "bg-red-100" },
  FIRE: { label: "Fire", icon: Flame, color: "text-orange-600", bg: "bg-orange-100" },
  ACCIDENT: { label: "Accident", icon: Car, color: "text-yellow-600", bg: "bg-yellow-100" },
  FLOOD: { label: "Flood", icon: Waves, color: "text-blue-600", bg: "bg-blue-100" },
  CRIME: { label: "Crime", icon: ShieldAlert, color: "text-purple-600", bg: "bg-purple-100" },
  OTHER: { label: "Other", icon: CircleHelp, color: "text-gray-600", bg: "bg-gray-100" },
};

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200" },
  RESOLVED: { label: "Resolved", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-500 border-gray-200" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function EmergencyPage() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);

  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [district, setDistrict] = useState("");
  const [isPriority, setIsPriority] = useState("ALL");

  const fetchEmergencies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await emergencyApi.getAll({
        page,
        limit: 9,
        type: type !== "ALL" ? type : undefined,
        status: status !== "ALL" ? status : undefined,
        district: district || undefined,
        isPriority: isPriority === "true" ? true : isPriority === "false" ? false : undefined,
      });
      setEmergencies(res?.data || []);
      setMeta(res?.meta || null);
    } catch {
      setEmergencies([]);
    } finally {
      setLoading(false);
    }
  }, [page, type, status, district, isPriority]);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);


  const resetFilters = () => {
    setType("ALL");
    setStatus("ALL");
    setDistrict("");
    setIsPriority("ALL");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmergencyFilters
          type={type}
          status={status}
          isPriority={isPriority}
          setType={setType}
          setStatus={setStatus}
          setIsPriority={setIsPriority}
          resetFilters={resetFilters}
          typeConfig={typeConfig}
          statusConfig={statusConfig}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : emergencies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <AlertTriangle className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">No emergencies found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {emergencies.map((e) => (
              <EmergencyCard key={e.id} emergency={e} typeConfig={typeConfig} statusConfig={statusConfig} timeAgo={timeAgo} />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-400">
              Page {meta.page} of {meta.totalPages} — {meta.total} emergencies
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-outline btn-sm rounded-xl gap-1">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="btn-outline btn-sm rounded-xl gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}