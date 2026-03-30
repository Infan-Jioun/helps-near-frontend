import { cookies } from "next/headers";



export const userService = {

    getSesstion: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${process.env.AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString()
                },
                cache: "no-store"
            })
            const session = await res.json();
            if (session === null) {
                return {
                    data: null, error: {
                        message: "session is missing"

                    }
                }

            }
            return { data: session, isPending: session, error: null }
        } catch (error) {
            console.error(error);
        }
    }
} 