export type UserRole = "ADMIN" | "VOLUNTEER" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    isVolunteer: boolean;
    createdAt: string;
}

export interface Meta {
    total: number;
    page: number;
    totalPages: number;
}

export const roleColors: Record<UserRole, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    VOLUNTEER: "bg-green-100 text-green-700 border-green-200",
    USER: "bg-blue-100 text-blue-700 border-blue-200",
};

export const statusColors: Record<UserStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    BLOCKED: "bg-red-100 text-red-700 border-red-200",
    DELETED: "bg-gray-100 text-gray-500 border-gray-200",
};