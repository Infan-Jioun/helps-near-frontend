import { Badge } from "@/components/ui/badge";
import { User, roleColors } from "./types";

interface SearchSuggestionsProps {
    query: string;
    users: User[];
    onSelect: (value: string) => void;
    visible: boolean;
}

export function SearchSuggestions({ query, users, onSelect, visible }: SearchSuggestionsProps) {
    if (!visible || !query.trim() || users.length === 0) return null;

    const q = query.toLowerCase();
    const suggestions = users
        .filter((u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
        .slice(0, 6);

    if (suggestions.length === 0) return null;

    return (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {suggestions.map((u) => (
                <button
                    key={u.id}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(u.name);
                    }}
                >
                    <div className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <Badge className={`${roleColors[u.role]} border text-xs ml-auto shrink-0`}>
                        {u.role}
                    </Badge>
                </button>
            ))}
        </div>
    );
}