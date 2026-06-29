import { NextRequest, NextResponse } from "next/server";
import { getAuthCookies } from "@/src/shared/lib/cookie.lib";
import { verifyAccessToken } from "@/src/shared/lib/jwt.lib";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { z } from "zod";

const BLOOD_TYPE_VALUES = [
    "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
    "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
] as const;

const medicalProfileSchema = z.object({
    heightCm:          z.coerce.number().positive().max(300).optional().nullable(),
    weightKg:          z.coerce.number().positive().max(500).optional().nullable(),
    organDonor:        z.boolean().optional(),
    insuranceProvider: z.string().max(200).optional().nullable(),
    bloodType:         z.enum(BLOOD_TYPE_VALUES).optional().nullable(),
});

export const dynamic = "force-dynamic";

async function getSessionUserId(): Promise<string | null> {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return null;
    try { return verifyAccessToken(accessToken).sub; }
    catch { return null; }
}

export async function GET() {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Tu sesión ha expirado o no has iniciado sesión. Por favor, vuelve a ingresar." }, { status: 401 });

    const mp = await prisma.medicalProfile.findUnique({ where: { userId } });
    return NextResponse.json({
        heightCm:          mp?.heightCm != null ? Number(mp.heightCm) : null,
        weightKg:          mp?.weightKg != null ? Number(mp.weightKg) : null,
        organDonor:        mp?.organDonor ?? false,
        insuranceProvider: mp?.insuranceProvider ?? null,
    });
}

export async function PUT(req: NextRequest) {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Tu sesión ha expirado o no has iniciado sesión. Por favor, vuelve a ingresar." }, { status: 401 });

    const body = await req.json();
    const parsed = medicalProfileSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { heightCm, weightKg, organDonor, insuranceProvider } = parsed.data;

    await prisma.medicalProfile.upsert({
        where: { userId },
        create: {
            userId,
            heightCm:          heightCm   ? Number(heightCm)   : null,
            weightKg:          weightKg   ? Number(weightKg)   : null,
            organDonor:        organDonor ?? false,
            insuranceProvider: insuranceProvider?.trim() || null,
        },
        update: {
            ...(heightCm          !== undefined && { heightCm:          heightCm   ? Number(heightCm)   : null }),
            ...(weightKg          !== undefined && { weightKg:          weightKg   ? Number(weightKg)   : null }),
            ...(organDonor        !== undefined && { organDonor }),
            ...(insuranceProvider !== undefined && { insuranceProvider: insuranceProvider?.trim() || null }),
        },
    });

    return NextResponse.json({ ok: true });
}
