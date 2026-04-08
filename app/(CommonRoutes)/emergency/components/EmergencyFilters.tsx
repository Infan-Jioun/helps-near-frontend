"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

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
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* District Search */}
        <div className="relative w-full md:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search District..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="pl-9 rounded-xl border-gray-200 focus:ring-red-500"
          />
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