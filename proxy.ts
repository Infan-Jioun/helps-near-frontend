import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


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

const authRoutes = ["/login", "/register", "/verify-email"];

const adminRoutes = [
    "/dashboard/admin",
    "/dashboard/admin/users-management",
    "/dashboard/admin/create-emergency",
    "/dashboard/admin/my-emergencies",
    "/dashboard/admin/volunteer-management",
    "/dashboard/admin/payment-management",
    "/emergency-management",
];

const volunteerRoutes = [
    "/dashboard/volunteer",
    "/create-emergency",
    "/myprofile",
    "/my-emergencies",
    "/payment-management",
];

const userRoutes = [
    "/dashboard/user",
    "/create-emergency",
    "/my-emergencies",
    "/payment-management",
];


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

function getDashboardByRole(role: string): string {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin";
        case "VOLUNTEER":
            return "/dashboard/volunteer";
        default:
            return "/dashboard/user";
    }
}


export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;


    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const accessToken = req.cookies.get("accessToken")?.value;
    const sessionToken = req.cookies.get("better-auth-session_token")?.value;

   
    if (!sessionToken) {
        if (isPublicRoute(pathname)) return NextResponse.next();

        return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url)
        );
    }

  
    let user: TokenPayload | null = null;

    if (accessToken) {
        user = await verifyAccessToken(accessToken);
    }


    if (!user) {
        if (isAuthRoute(pathname)) return NextResponse.next();

        const res = NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url)
        );
        res.cookies.delete("accessToken");
        res.cookies.delete("better-auth-session_token");
        return res;
    }

   
    if (isAuthRoute(pathname)) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }


    if (
        adminRoutes.some((r) => pathname.startsWith(r)) &&
        user.role !== "ADMIN"
    ) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }

    if (
        volunteerRoutes.some((r) => pathname.startsWith(r)) &&
        !["VOLUNTEER", "ADMIN"].includes(user.role)
    ) {
        return NextResponse.redirect(
            new URL(getDashboardByRole(user.role), req.url)
        );
    }


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

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};