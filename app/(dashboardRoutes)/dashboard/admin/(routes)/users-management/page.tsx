"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ShieldX,
    Loader2,
    CircleAlert,
    UserCheck,
} from "lucide-react";
import { userApi } from "@/lib/userApi";


const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    VOLUNTEER: "bg-green-100 text-green-700 border-green-200",
    USER: "bg-blue-100 text-blue-700 border-blue-200",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    BLOCKED: "bg-red-100 text-red-700 border-red-200",
    DELETED: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function UsersManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await userApi.getAllUsers({
                page,
                limit: 10,
                searchTerm: searchTerm || undefined,
                role: role === "ALL" ? undefined : role,
                status: status === "ALL" ? undefined : status,
            });
            setUsers(res?.data || []);
            setMeta(res?.meta || null);
        } catch {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, role, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleRoleUpdate = async (id: string, newRole: string) => {
        try {
            setActionLoading(id + "-role");
            await userApi.updateUserRole(id, newRole);
            fetchUsers();
        } catch {
            setError("Failed to update role.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setActionLoading(id + "-status");
            await userApi.updateUserStatus(id, newStatus);
            fetchUsers();
        } catch {
            setError("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-400">
                            {meta?.total || 0} total users
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    className="gap-2 rounded-xl"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 rounded-xl"
                            />
                        </div>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                            Search
                        </Button>
                    </form>

                    <Select value={role} onValueChange={(v) => { setRole(v); setPage(1); }}>
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

                    <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
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

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-4">
                    <CircleAlert className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Users className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No users found</p>
                    </div>
                ) : (
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

                                    <TableCell>
                                        <Badge className={`${roleColors[user.role]} border text-xs`}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={`${statusColors[user.status]} border text-xs`}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>

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

                                    <TableCell className="text-xs text-gray-400">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.status === "ACTIVE" ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-xs gap-1.5 h-8"
                                                    disabled={actionLoading === user.id + "-status"}
                                                    onClick={() => handleStatusUpdate(user.id, "BLOCKED")}
                                                >
                                                    {actionLoading === user.id + "-status" ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <ShieldX className="w-3.5 h-3.5" />
                                                    )}
                                                    Block
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg text-xs gap-1.5 h-8"
                                                    disabled={actionLoading === user.id + "-status"}
                                                    onClick={() => handleStatusUpdate(user.id, "ACTIVE")}
                                                >
                                                    {actionLoading === user.id + "-status" ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    )}
                                                    Unblock
                                                </Button>
                                            )}

                                            {user.role !== "ADMIN" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 rounded-lg text-xs gap-1.5 h-8"
                                                    disabled={actionLoading === user.id + "-role"}
                                                    onClick={() => handleRoleUpdate(user.id, "ADMIN")}
                                                >
                                                    {actionLoading === user.id + "-role" ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    )}
                                                    Make Admin
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-400">
                        Page {meta.page} of {meta.totalPages} — {meta.total} users
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-1"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-1"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}