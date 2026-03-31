"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Users, CircleAlert, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

import { userApi } from "@/lib/userApi";
import { User, Meta } from "./components/types";
import { UsersFilters } from "./components/Usersfilters";
import { UsersTable } from "./components/Userstable";
import { DeleteDialog } from "./components/Deletedialog";


export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const fetchUsers = useCallback(async (overrideSearch?: string) => {
        try {
            setLoading(true);
            setError("");
            const res = await userApi.getAllUsers({
                page,
                limit: 10,
                searchTerm: (overrideSearch ?? searchTerm) || undefined,
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
    }, [page, role, status, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [page, role, status]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setShowSuggestions(false);
        fetchUsers();
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setShowSuggestions(true);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setPage(1);
        fetchUsers("");
    };

    const handleSuggestionSelect = (value: string) => {
        setSearchTerm(value);
        setShowSuggestions(false);
        setPage(1);
        fetchUsers(value);
    };

    const handleRoleChange = (value: string) => {
        setRole(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const handleRoleUpdate = async (id: string, newRole: string) => {
        try {
            setActionLoading(id + "-role");
            await userApi.updateUserRole(id, newRole);
            toast.success("Role updated successfully");
            fetchUsers();
        } catch {
            toast.error("Failed to update role");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setActionLoading(id + "-status");
            await userApi.updateUserStatus(id, newStatus);
            toast.success(newStatus === "BLOCKED" ? "User blocked" : "User unblocked");
            fetchUsers();
        } catch {
            toast.error("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const targetName = deleteTarget.name;
        const targetId = deleteTarget.id;

        try {
            setDeleteLoading(true);
            // Optimistic UI — আগেই list থেকে সরাও
            setUsers((prev) => prev.filter((u) => u.id !== targetId));
            setMeta((prev) => prev ? { ...prev, total: prev.total - 1 } : prev);
            setDeleteTarget(null);

            await userApi.deleteUser(targetId);
            toast.success(`${targetName} deleted successfully`);
            fetchUsers();
        } catch {
            toast.error("Failed to delete user. Please try again.");
            fetchUsers(); // rollback
        } finally {
            setDeleteLoading(false);
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
                        <p className="text-sm text-gray-400">{meta?.total || 0} total users</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchUsers()} className="gap-2 rounded-xl">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <UsersFilters
                searchTerm={searchTerm}
                role={role}
                status={status}
                users={users}
                showSuggestions={showSuggestions}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
                onSuggestionSelect={handleSuggestionSelect}
                onShowSuggestions={setShowSuggestions}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
            />

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-4">
                    <CircleAlert className="w-4 h-4 shrink-0" />
                    {error}
                    <button type="button" onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                    </div>
                ) : (
                    <UsersTable
                        users={users}
                        actionLoading={actionLoading}
                        deleteLoading={deleteLoading}
                        onStatusUpdate={handleStatusUpdate}
                        onRoleUpdate={handleRoleUpdate}
                        onDeleteClick={setDeleteTarget}
                    />
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
                            variant="outline" size="sm" className="rounded-xl gap-1"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </Button>
                        <Button
                            variant="outline" size="sm" className="rounded-xl gap-1"
                            disabled={page >= meta.totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <DeleteDialog
                user={deleteTarget}
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}