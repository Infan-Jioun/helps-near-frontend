import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://helps-near-backend-blond.vercel.app",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});