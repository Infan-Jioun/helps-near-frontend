import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL
        ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`
        : "/api/auth",

    fetchOptions: { credentials: "include" },
     
    plugins: [
        {
            id: "next-cookies-request",
            fetchPlugins: [
                {
                    id: "next-cookies-request-plugin",
                    name: "next-cookies-request-plugin",
                    hooks: {
                        async onRequest(ctx) {
                            if (typeof window === "undefined") {
                                const { cookies } = await import("next/headers");
                                const headers = await cookies();
                                ctx.headers.set("cookie", headers.toString());
                            }
                        },
                    },
                },
            ],
        },
        emailOTPClient(),
    ],

});
