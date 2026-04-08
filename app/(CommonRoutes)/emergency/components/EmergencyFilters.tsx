/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { emergencyApi } from "@/lib/emergencyApi";

interface EmergencyFiltersProps {
  type: string;
  status: string;
  isPriority: string;
  district: string;
  setType: (val: string) => void;
  setStatus: (val: string) => void;
  setIsPriority: (val: string) => void;
  setDistrict: (val: string) => void;
  resetFilters: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeConfig: Record<string, any>;
  statusConfig: Record<string, any>;
}

export default function EmergencyFilters({
  type,
  status,
  isPriority,
  district,
  setType,
  setStatus,
  setIsPriority,
  setDistrict,
  resetFilters,
  typeConfig,
  statusConfig,
}: EmergencyFiltersProps) {
  const [inputValue, setInputValue] = useState(district);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external district reset (e.g. when resetFilters is called)
  useEffect(() => {
    setInputValue(district);
  }, [district]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      setLoadingSuggestions(true);
      const res = await emergencyApi.getAll({ district: query, limit: 20 });
      const items: any[] = res?.data || [];

      // Extract unique district names from results
      const unique = Array.from(
        new Set(
          items
            .map((e: any) => e.district)
            .filter((d: string) => d && d.toLowerCase().includes(query.toLowerCase()))
        )
      ) as string[];

      setSuggestions(unique.slice(0, 6));
      setShowSuggestions(unique.length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Apply filter with debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDistrict(val);
      fetchSuggestions(val);
    }, 350);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setDistrict(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInputValue("");
    setDistrict("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">

        {/* District Search with Suggestions */}
        <div ref={wrapperRef} className="relative w-full md:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            placeholder="Search District..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-9 pr-8 rounded-xl border-gray-200 focus:ring-red-500"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Suggestion Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
              {loadingSuggestions ? (
                <div className="px-3 py-2.5 text-xs text-gray-400">Searching...</div>
              ) : (
                suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur before click fires
                      handleSelectSuggestion(s);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    {s}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Type Select */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full md:w-36 rounded-xl">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.entries(typeConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-40 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Select */}
        <Select value={isPriority} onValueChange={setIsPriority}>
          <SelectTrigger className="w-full md:w-36 rounded-xl">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priority</SelectItem>
            <SelectItem value="true">Priority Only</SelectItem>
            <SelectItem value="false">Normal Only</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 hover:text-red-600 gap-2 rounded-xl ml-auto"
        >
          <Filter className="w-4 h-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}