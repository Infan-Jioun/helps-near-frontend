import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// পাবলিক route (login ছাড়া ঢুকতে পারবে)
const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/volunteer-register",
    "/verify-email",
    "/how-it-works",
    "/contact",
    "/emergency",
    "/volunteers",
];

// auth page (logged in থাকলে ঢুকতে পারবে না)
const authRoutes = ["/login", "/register", "/verify-email"];

// role-based routes
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

// JWT verify
async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
}

// role অনুযায়ী dashboard
function getDashboardByRole(role: string): string {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "VOLUNTEER") return "/dashboard/volunteer";
    return "/dashboard/user";
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // static ignore
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const accessToken = req.cookies.get("accessToken")?.value;

    let user: TokenPayload | null = null;

    if (accessToken) {
        user = await verifyAccessToken(accessToken);
    }

    // ❌ not logged in
    if (!user) {
        if (isPublicRoute(pathname)) return NextResponse.next();

        return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url)
        );
    }

    // ❌ logged in user trying to access login/register
    if (isAuthRoute(pathname)) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    // 🔐 ADMIN guard
    if (
        adminRoutes.some((r) => pathname.startsWith(r)) &&
        user.role !== "ADMIN"
    ) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    // 🔐 VOLUNTEER guard
    if (
        volunteerRoutes.some((r) => pathname.startsWith(r)) &&
        !["VOLUNTEER", "ADMIN"].includes(user.role)
    ) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    // 🔐 USER guard
    if (
        userRoutes.some((r) => pathname.startsWith(r)) &&
        !["USER", "VOLUNTEER", "ADMIN"].includes(user.role)
    ) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    return NextResponse.next();
}

// matcher
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};