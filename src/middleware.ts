import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/src/shared/lib/jwt.lib";
import { COOKIE_NAMES } from "@/src/shared/lib/cookie.lib";

// Rutas que requieren estar autenticado
const PROTECTED_ROUTES = [
    "/dashboard",
    "/profile",
    "/emergency",
];

// Rutas que NO deben verse si ya estás autenticado
const AUTH_ROUTES = [
    "/login",
    "/register",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken  = request.cookies.get(COOKIE_NAMES.accessToken)?.value;

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

    let isAuthenticated = false;
    if (accessToken) {
        try {
            verifyAccessToken(accessToken);
            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    // Sin token válido → intenta renovar usando refresh cookie.
    // El refresh cookie está restringido a `/api/auth/refresh`, por eso redirigimos allí.
    if (isProtected && !isAuthenticated) {
        const next = request.nextUrl.pathname + request.nextUrl.search;
        const refreshUrl = new URL("/api/auth/refresh", request.url);
        refreshUrl.searchParams.set("next", next);
        return NextResponse.redirect(refreshUrl);
    }

    // Ya autenticado → no puede volver a login/register
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};