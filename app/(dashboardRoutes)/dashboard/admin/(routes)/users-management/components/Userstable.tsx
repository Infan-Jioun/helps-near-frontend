import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    ShieldCheck,
    ShieldX,
    Loader2,
    UserCheck,
    Trash2,
} from "lucide-react";
import { User, roleColors, statusColors } from "./types";

interface UsersTableProps {
    users: User[];
    actionLoading: string | null;
    deleteLoading: boolean;
    onStatusUpdate: (id: string, status: string) => void;
    onRoleUpdate: (id: string, role: string) => void;
    onDeleteClick: (user: User) => void;
}

export function UsersTable({
    users,
    actionLoading,
    deleteLoading,
    onStatusUpdate,
    onRoleUpdate,
    onDeleteClick,
}: UsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Users className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">No users found</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">User</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Volunteer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Joined</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">

                        {/* User info */}
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-sm font-bold shrink-0">
                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                            <Badge className={`${roleColors[user.role]} border text-xs`}>
                                {user.role}
                            </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                            <Badge className={`${statusColors[user.status]} border text-xs`}>
                                {user.status}
                            </Badge>
                        </TableCell>

                        {/* Volunteer */}
                        <TableCell>
                            {user.isVolunteer ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Yes
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">No</span>
                            )}
                        </TableCell>

                        {/* Joined */}
                        <TableCell className="text-xs text-gray-400">
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })
                                : "—"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">

                                {/* Block / Unblock */}
                                {user.status === "ACTIVE" ? (
                                    <Button
                                        size="sm" variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-xs gap-1.5 h-8"
                                        disabled={!!actionLoading}
                                        onClick={() => onStatusUpdate(user.id, "BLOCKED")}
                                    >
                                        {actionLoading === user.id + "-status"
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <ShieldX className="w-3.5 h-3.5" />}
                                        Block
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm" variant="outline"
                                        className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg text-xs gap-1.5 h-8"
                                        disabled={!!actionLoading}
                                        onClick={() => onStatusUpdate(user.id, "ACTIVE")}
                                    >
                                        {actionLoading === user.id + "-status"
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <ShieldCheck className="w-3.5 h-3.5" />}
                                        Unblock
                                    </Button>
                                )}

                                {/* Make Admin */}
                                {user.role !== "ADMIN" && (
                                    <Button
                                        size="sm" variant="outline"
                                        className="text-purple-600 border-purple-200 hover:bg-purple-50 rounded-lg text-xs gap-1.5 h-8"
                                        disabled={!!actionLoading}
                                        onClick={() => onRoleUpdate(user.id, "ADMIN")}
                                    >
                                        {actionLoading === user.id + "-role"
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <ShieldCheck className="w-3.5 h-3.5" />}
                                        Make Admin
                                    </Button>
                                )}

                                {/* Delete — ADMIN দেখাবে না */}
                                {user.role !== "ADMIN" && (
                                    <Button
                                        size="sm" variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-xs gap-1.5 h-8"
                                        disabled={!!actionLoading || deleteLoading}
                                        onClick={() => onDeleteClick(user)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}