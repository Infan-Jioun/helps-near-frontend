/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface EmergencyFiltersProps {
  type: string;
  status: string;
  isPriority: string;
  search: string;
  setType: (val: string) => void;
  setStatus: (val: string) => void;
  setIsPriority: (val: string) => void;
  setSearch: (val: string) => void;
  resetFilters: () => void;
  handleSearch: (e: React.FormEvent) => void;
  typeConfig: Record<string, any>;
  statusConfig: Record<string, any>;
}

export default function EmergencyFilters({
  type, status, isPriority, search,
  setType, setStatus, setIsPriority, setSearch,
  resetFilters, handleSearch, typeConfig, statusConfig
}: EmergencyFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select value={type} onValueChange={(v) => setType(v)}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.entries(typeConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={isPriority} onValueChange={(v) => setIsPriority(v)}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="true">Priority Only</SelectItem>
              <SelectItem value="false">Normal Only</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2 rounded-xl">
            <Filter className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}