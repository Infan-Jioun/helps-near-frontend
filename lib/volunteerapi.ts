import { axiosInstance } from "@/lib/axiosInstance";

export const volunteerApi = {

    getAllVolunteers: async (params?: {
        searchTerm?: string;
        isVerified?: boolean;
        page?: number;
        limit?: number;
    }) => {
        const res = await axiosInstance.get("/api/v1/volunteer", { params });
        return res.data;
    },

    getMyVolunteerProfile: async () => {
        const res = await axiosInstance.get("/api/v1/volunteer/myprofile");
        return res.data;
    },


    updateMyVolunteerProfile: async (payload: {
        name?: string;
        phone?: string;
        bio?: string;
        skills?: string[];
        latitude?: number;
        longitude?: number;
        profilePhoto?: string;
    }) => {
        const res = await axiosInstance.patch("/api/v1/volunteer/myprofile", payload);
        return res.data;
    },


    getVolunteerById: async (userId: string) => {
        const res = await axiosInstance.get(`/api/v1/volunteer/${userId}`);
        return res.data;
    },

  
    verifyVolunteer: async (userId: string, isVerified: boolean) => {
        const res = await axiosInstance.patch(`/api/v1/volunteer/${userId}`, { isVerified });
        return res.data;
    },

    deleteVolunteer: async (userId: string) => {
        const res = await axiosInstance.delete(`/api/v1/volunteer/${userId}`);
        return res.data;
    },
};