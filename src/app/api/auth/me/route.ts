import { NextResponse } from "next/server";
import { getAuthCookies } from "@/src/shared/lib/cookie.lib";
import { verifyAccessToken } from "@/src/shared/lib/jwt.lib";

export async function GET() {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return NextResponse.json({ loggedIn: false });
    try {
        verifyAccessToken(accessToken);
        return NextResponse.json({ loggedIn: true });
    } catch {
        return NextResponse.json({ loggedIn: false });
    }
}
