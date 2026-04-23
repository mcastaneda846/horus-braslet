import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const COOKIE_NAMES = {
    accessToken: "access_token",
    refreshToken: "refresh_token",
} as const;

const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
): NextResponse {
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set(COOKIE_NAMES.accessToken, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: ACCESS_MAX_AGE,
        path: "/",
    });

    response.cookies.set(COOKIE_NAMES.refreshToken, refreshToken, {
        httpOnly: true,
        secure:   isProduction,
        sameSite: "lax",
        maxAge:   REFRESH_MAX_AGE,
        path:     "/api/auth/refresh", // Solo accesible desde el endpoint de refresh
    });

    return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.delete(COOKIE_NAMES.accessToken);
    response.cookies.delete(COOKIE_NAMES.refreshToken);
    return response;
}

export async function getAuthCookies() {
    const cookieStore = await cookies();
    return {
        accessToken: cookieStore.get(COOKIE_NAMES.accessToken)?.value,
        refreshToken: cookieStore.get(COOKIE_NAMES.refreshToken)?.value,
    }
}