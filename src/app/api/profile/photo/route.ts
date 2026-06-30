import { NextRequest, NextResponse } from "next/server";
import { getAuthCookies } from "@/src/shared/lib/cookie.lib";
import { verifyAccessToken } from "@/src/shared/lib/jwt.lib";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import cloudinary from "@/src/infrastructure/cloudinary/cloudinary";

async function getSessionUserId(): Promise<string | null> {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return null;
    try { return verifyAccessToken(accessToken).sub; }
    catch { return null; }
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: NextRequest) {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Tu sesión ha expirado o no has iniciado sesión. Por favor, vuelve a ingresar." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("photo") as File | null;

    if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: "Solo se permiten imágenes (jpg, png, webp, gif)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Imagen muy grande (máx 5MB)" }, { status: 413 });
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "horus/profiles",
                public_id: userId,
                overwrite: true,
                invalidate: true,
                resource_type: "image",
                transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
            },
            (error, result) => {
                if (error || !result) return reject(error || new Error("Sin respuesta de Cloudinary"));
                resolve(result);
            }
        );
        stream.on("error", reject);
        stream.end(buffer);
    });

    // Cachebuster para forzar recarga cuando se sobreescribe la misma public_id
    const photoUrl = `${result.secure_url}?v=${Date.now()}`;

    await prisma.personalInformation.upsert({
        where: { userId },
        create: { userId, firstName: "", lastName: "", photoUrl },
        update: { photoUrl },
    });

    return NextResponse.json({ photoUrl });
}
