import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: typeof window !== "undefined"
        ? "" 
        : process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await axiosInstance.post("/api/v1/auth/refresh-token");
                return axiosInstance(error.config);
            } catch {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);