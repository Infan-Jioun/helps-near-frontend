import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "https://hepls-near.vercel.app",
    plugins: [emailOTPClient()],
    fetchOptions: {
        credentials: "include",
        onResponse(context) {
            console.log("Better Auth Response:", context.response.headers);
        },
    },
});