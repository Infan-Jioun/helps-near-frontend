import { axiosInstance } from "@/lib/axiosInstance";

export const volunteerResponseApi = {
    getMyResponses: async () => {
        const res = await axiosInstance.get("/api/v1/volunteer-response/my");
        return res.data;
    },

    accept: async (
        emergencyId: string,
        payload?: { estimatedArrivalMin?: number }
    ) => {
        const res = await axiosInstance.post(
            `/api/v1/volunteer-response/${emergencyId}`,
            payload ?? {}
        );
        return res.data;
    },

    getByEmergencyId: async (emergencyId: string) => {
        const res = await axiosInstance.get(
            `/api/v1/volunteer-response/${emergencyId}`
        );
        return res.data;
    },

    cancel: async (emergencyId: string) => {
        const res = await axiosInstance.delete(
            `/api/v1/volunteer-response/${emergencyId}`
        );
        return res.data;
    },
};