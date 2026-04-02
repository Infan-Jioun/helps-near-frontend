import { axiosInstance } from "@/lib/axiosInstance";

export const emergencyApi = {
    create: async (payload: {
        type: "MEDICAL" | "FIRE" | "ACCIDENT" | "FLOOD" | "CRIME" | "OTHER";
        description?: string;
        imageUrl?: string;
        latitude: number;
        longitude: number;
        address?: string;
        district?: string;
        isPriority?: boolean;
    }) => {
        const res = await axiosInstance.post("/api/v1/emergency", payload);
        return res.data;
    },
    getMyEmergencies: async () => {
        const res = await axiosInstance.get(`/api/v1/emergency/my-emergencies`);
        return res.data;
    },
    getAll: async (params?: {
        type?: string;
        status?: string;
        district?: string;
        isPriority?: boolean;
        page?: number;
        limit?: number;
    }) => {
        const res = await axiosInstance.get("/api/v1/emergency", { params });
        return res.data;
    },

    getById: async (id: string) => {
        const res = await axiosInstance.get(`/api/v1/emergency/${id}`);
        return res.data;
    },

    update: async (
        id: string,
        payload: {
            status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
            description?: string;
            address?: string;
            district?: string;
            isPriority?: boolean;
        }
    ) => {
        const res = await axiosInstance.patch(`/api/v1/emergency/${id}`, payload);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await axiosInstance.delete(`/api/v1/emergency/${id}`);
        return res.data;
    },
};