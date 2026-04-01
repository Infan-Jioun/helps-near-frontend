import { cookies } from "next/headers";

export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();
            const allCookies = cookieStore.getAll()
                .map(c => `${c.name}=${c.value}`)
                .join("; ");

            const res = await fetch(`${process.env.AUTH_URL}/get-session`, {
                headers: {
                    Cookie: allCookies,
                },
                cache: "no-store",
            });

            const session = await res.json();
            if (!session) return { data: null, error: { message: "No session" } };
            return { data: session, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Failed to fetch session" } };
        }
    }
};