import jwt from "jsonwebtoken";
import type { JwtAccessPayload, JwtRefreshPayload } from "../types/jwt.types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

export function signAccessToken(payload: Omit<JwtAccessPayload, "type">): string {
    return jwt.sign(
        {...payload, type: "access" } satisfies JwtAccessPayload,
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRY }
    );
}

export function signRefreshToken(userId: string): string {
    return jwt.sign(
        { sub: userId, type: "refresh" } satisfies JwtRefreshPayload,
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRY }
    );
}

export function verifyAccessToken(token: string): JwtAccessPayload {
    return jwt.verify(token, ACCESS_SECRET) as JwtAccessPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
    return jwt.verify(token, REFRESH_SECRET) as JwtRefreshPayload;
}