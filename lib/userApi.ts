import { axiosInstance } from "@/lib/axiosInstance";

export const userApi = {
    createVolunteer: async (payload: {
        name: string;
        email: string;
        password: string;
        nidNumber?: string;
        skills?: string[];
        bio?: string;
        latitude?: number;
        longitude?: number;
        fee: number;
        isFree?: boolean;
    }) => {
        const res = await axiosInstance.post("/api/v1/users/create-volunteer", payload);
        return res.data;
    },

    getAllUsers: async (params?: {
        role?: string;
        status?: string;
        searchTerm?: string;
        page?: number;
        limit?: number;
    }) => {
        const res = await axiosInstance.get("/api/v1/users", { params });
        return res.data;
    },

    getUserById: async (id: string) => {
        const res = await axiosInstance.get(`/api/v1/users/${id}`);
        return res.data;
    },

    updateUserRole: async (id: string, role: string) => {
        const res = await axiosInstance.patch(`/api/v1/users/${id}`, { role });
        return res.data;
    },

    updateUserStatus: async (id: string, status: string) => {
        const res = await axiosInstance.patch(`/api/v1/users/${id}/status`, { status });
        return res.data;
    },
    deleteUser: async (id: string) => {
        const res = await axiosInstance.delete(`/api/v1/users/${id}`);
        return res.data;
    },
    // getMe: async () => {
    //     const res = await axiosInstance.get("/api/v1/users/me");
    //     return res.data;
    // },

    // updateMe: async (payload: {
    //     name?: string;
    //     phone?: string;
    //     profileImage?: string;
    //     bloodGroup?: string;
    //     latitude?: number;
    //     longitude?: number;
    // }) => {
    //     const res = await axiosInstance.patch("/api/v1/users/me", payload);
    //     return res.data;
    // },


};