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

    // Sin token válido → redirige a login
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname); // recuerda a dónde iba
        return NextResponse.redirect(loginUrl);
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