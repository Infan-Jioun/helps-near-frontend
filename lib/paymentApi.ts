import { axiosInstance } from "@/lib/axiosInstance";

export const paymentApi = {
    createIntent: async (payload: {
        emergencyId: string;
        amount: number;
    }) => {
        const res = await axiosInstance.post("/api/v1/payment/create-intent", payload);
        return res.data;
    },

    confirmPayment: async (paymentIntentId: string) => {
        const res = await axiosInstance.get(`/api/v1/payment/confirm/${paymentIntentId}`);
        return res.data;
    },

    getMyPayments: async () => {
        const res = await axiosInstance.get("/api/v1/payment/my");
        return res.data;
    },

    getAllPayments: async () => {
        const res = await axiosInstance.get("/api/v1/payment");
        return res.data;
    },
};