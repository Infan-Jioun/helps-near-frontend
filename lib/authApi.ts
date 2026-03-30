import { axiosInstance } from "@/lib/axiosInstance";

export const authApi = {
    register: async (payload: {
        name: string;
        email: string;
        password: string;
    }) => {
        const res = await axiosInstance.post("/api/v1/auth/register", payload);
        return res.data;
    },

    login: async (payload: { email: string; password: string }) => {
        const res = await axiosInstance.post("/api/v1/auth/login", payload);
        return res.data;
    },

    logout: async () => {
        const res = await axiosInstance.post("/api/v1/auth/logout");
        return res.data;
    },

    getMe: async () => {
        const res = await axiosInstance.get("/api/v1/auth/me");
        return res.data;
    },
    verifyOtp: async (payload: { email: string; otp: string }) => {
        const res = await axiosInstance.post("/api/v1/auth/verify-email", {
            email: payload.email,
            otp: payload.otp,
        });
        return res.data;
    },

    resendOtp: async (payload: { email: string }) => {
        const res = await axiosInstance.post("/api/v1/auth/resend-otp", {
            email: payload.email,
            type: "email-verification",
        });
        return res.data;
    },


};