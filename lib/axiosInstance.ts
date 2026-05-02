import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: typeof window !== "undefined"
//         ? ""
//         : process.env.NEXT_PUBLIC_BACKEND_URL,
//     withCredentials: true,
// });
export const axiosInstance = axios.create({

    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
        const token = match?.[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response?.status === 401) {
//             try {
//                 await axiosInstance.post("/api/v1/auth/refresh-token");
//                 return axiosInstance(error.config);
//             } catch {
//                 window.location.href = "/login";
//             }
//         }
//         return Promise.reject(error);
//     }
// );