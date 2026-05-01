import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/", "/login", "/register", "/volunteer-register",
    "/verify-email", "/how-it-works", "/contact",
    "/emergency", "/volunteers",
];
const authRoutes = ["/login", "/register", "/verify-email"];
const adminRoutes = ["/dashboard/admin"];
const volunteerRoutes = ["/dashboard/volunteer"];
const userRoutes = ["/dashboard/user"];

function isPublicRoute(pathname: string) {
    return publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
}

function isAuthRoute(pathname: string) {
    return authRoutes.some((route) => pathname.startsWith(route));
}

interface TokenPayload {
    userId: string;
    role: string;
    email: string;
}

async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
}

async function verifyBetterAuthSession(sessionToken: string): Promise<TokenPayload | null> {
    try {
        const res = await fetch(
            `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
            {
                headers: { cookie: `session_token=${sessionToken}` },
                cache: "no-store",
            }
        );
        if (!res.ok) return null;
        const session = await res.json();
        if (!session?.user) return null;
        return {
            userId: session.user.id,
            email: session.user.email,
            role: session.user.role ?? "USER",
        };
    } catch {
        return null;
    }
}

function getDashboardByRole(role: string): string {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "VOLUNTEER") return "/dashboard/volunteer";
    return "/dashboard/user";
}

// ── Frontend Page Visit Logger ────────────────────────────────────────────────
async function logPageVisit(req: NextRequest, user: TokenPayload | null) {
    // static asset বা api call log করবো না
    const { pathname } = req.nextUrl;
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) return;

    try {
        const rawIp =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            ?? req.headers.get("x-real-ip")
            ?? "unknown";

        const cleanIp = rawIp.replace(/^::ffff:/, "");

        await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/frontend-logs`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json"  , Authorization: `Bearer ${req.cookies.get("accessToken")?.value ?? ""}` },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    method: req.method,
                    path: pathname,
                    userAgent: req.headers.get("user-agent") ?? "unknown",
                    ip: cleanIp,
                    userId: user?.userId ?? "guest",
                    role: user?.role ?? "guest",
                }),
            }
        );
    } catch {
        // silent fail — page block হবে না
    }
}

// ── Main Middleware ───────────────────────────────────────────────────────────
export default async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // static files skip করো
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    let user: TokenPayload | null = null;

    // 1. Custom JWT (email/password login)
    const accessToken = req.cookies.get("accessToken")?.value;
    if (accessToken) {
        user = await verifyAccessToken(accessToken);
    }

    // 2. Better Auth session (Google OAuth)
    if (!user) {
        const sessionToken = req.cookies.get("session_token")?.value;
        if (sessionToken) {
            user = await verifyBetterAuthSession(sessionToken);
        }
    }


    logPageVisit(req, user);

    // Auth guard
    if (!user) {
        if (isPublicRoute(pathname)) return NextResponse.next();
        return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url)
        );
    }


    if (isAuthRoute(pathname)) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    // Role guard — admin
    if (adminRoutes.some((r) => pathname.startsWith(r)) && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL(getDashboardByRole(user.role), req.url));
    }

    // Role guard — volunteer
    if (
        volunteerRoutes.some((r) => pathname.startsWith(r)) &&
        !["VOLUNTEER", "ADMIN"].includes(user.role)
    ) {
        return NextResponse.redirect(new URL(getDashboardByRole(user.role), req.url));
    }

    // Role guard — user
    if (
        userRoutes.some((r) => pathname.startsWith(r)) &&
        !["USER", "VOLUNTEER", "ADMIN"].includes(user.role)
    ) {
        return NextResponse.redirect(new URL(getDashboardByRole(user.role), req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};