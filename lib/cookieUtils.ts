"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

const getTokenSecondsRemaining = (token: string): number => {
    try {
        const payload = jwt.decode(token) as JwtPayload;
        if (!payload?.exp) return 0;
        const remaining = payload.exp - Math.floor(Date.now() / 1000);
        return remaining > 0 ? remaining : 0;
    } catch {
        return 0;
    }
};

export const setCookie = async (name: string, value: string, maxAgeInSeconds: number) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: maxAgeInSeconds,
    });
};

export const getCookie = async (name: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
};

export const deleteCookie = async (name: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
};

export const setTokenInCookies = async (
    name: string,
    token: string,
    fallbackMaxAge = 60 * 60 * 24
) => {
    const maxAge = getTokenSecondsRemaining(token) || fallbackMaxAge;
    await setCookie(name, token, maxAge);
};

export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
    await setTokenInCookies("accessToken", accessToken, 60 * 60 * 24);
    await setTokenInCookies("refreshToken", refreshToken, 60 * 60 * 24 * 7);
};

export const clearAuthCookies = async () => {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
};