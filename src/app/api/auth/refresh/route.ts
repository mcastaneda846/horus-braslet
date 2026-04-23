import { NextResponse } from "next/server";
import { AuthRepositoryImpl } from "@/src/infrastructure/repositories/auth.repository.impl";
import { refreshTokenUseCase } from "@/src/application/auth/refresh-token.use-case";
import { getAuthCookies, setAuthCookies } from "@/src/shared/lib/cookie.lib";
import { AppError } from "@/src/shared/errors/app.error";

const repository = new AuthRepositoryImpl();

export async function POST() {
    try {

        const { refreshToken: currentRefreshToken } = await getAuthCookies();

        const { accessToken, refreshToken } = await refreshTokenUseCase(
            repository,
            currentRefreshToken
        );

        const response = NextResponse.json(
            { message: "Token renovado" },
            { status: 200 }
        );

        return setAuthCookies(response, accessToken, refreshToken);

    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json(
                { message: error.message, code: error.code },
                { status: error.statusCode }
            );
        }

        console.error("[REFRESH_ERROR]", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}