import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/verify-email", "/how-it-works", "/contact", "/emergency", "/volunteers"];
const authRoutes = ["/login", "/register", "/verify-email"];


function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
}

function isAuthRoute(pathname: string): boolean {
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



const getDashboardByRole = (role: string): string => {
    switch (role) {
        case "ADMIN": return "/dashboard/admin";
        case "VOLUNTEER": return "/dashboard/volunteer";
        default: return "/dashboard/user";
    }
}



export async function middleware(req: NextRequest) {
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


    if (!accessToken && !sessionToken) {
        if (isPublicRoute(pathname)) return NextResponse.next();
        return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url));
    }


    let user: TokenPayload | null = null;

    if (accessToken) {
        user = await verifyAccessToken(accessToken);
    }
    if (!user && sessionToken) {
        if (isAuthRoute(pathname)) {
          
            return NextResponse.redirect(new URL("/dashboard/user", req.url));
        }
        return NextResponse.next();
    }

  
    if (!user) {
        if (isAuthRoute(pathname)) return NextResponse.next();

        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("better-auth-session_token");
        return response;
    }


    // Wrong dashboard access → unauthorized
    if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (
        pathname.startsWith("/dashboard/volunteer") &&
        user.role !== "VOLUNTEER" &&
        user.role !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (
        pathname.startsWith("/dashboard/user") &&
        !["USER", "ADMIN", "VOLUNTEER"].includes(user.role)
    ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};