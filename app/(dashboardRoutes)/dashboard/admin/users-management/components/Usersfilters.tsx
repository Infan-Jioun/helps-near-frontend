import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { SearchSuggestions } from "./Searchsuggestions";
import { User } from "./types";

interface UsersFiltersProps {
    searchTerm: string;
    role: string;
    status: string;
    users: User[];
    showSuggestions: boolean;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onClearSearch: () => void;
    onSuggestionSelect: (value: string) => void;
    onShowSuggestions: (show: boolean) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export function UsersFilters({
    searchTerm,
    role,
    status,
    users,
    showSuggestions,
    onSearchChange,
    onSearchSubmit,
    onClearSearch,
    onSuggestionSelect,
    onShowSuggestions,
    onRoleChange,
    onStatusChange,
}: UsersFiltersProps) {
    const searchRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <form onSubmit={onSearchSubmit} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                            ref={searchRef}
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onFocus={() => onShowSuggestions(true)}
                            onBlur={() => setTimeout(() => onShowSuggestions(false), 150)}
                            className="pl-9 pr-8 rounded-xl"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <SearchSuggestions
                            query={searchTerm}
                            users={users}
                            onSelect={onSuggestionSelect}
                            visible={showSuggestions}
                        />
                    </div>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                        Search
                    </Button>
                </form>

                {/* Role filter */}
                <Select value={role} onValueChange={onRoleChange}>
                    <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status filter */}
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="DELETED">Deleted</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}