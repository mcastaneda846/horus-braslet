import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ingestUseCase } from "@/src/application/ai/ingest.use-case";

const Schema = z.object({
    fileName:    z.string().endsWith(".md"),
    fileContent: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body   = await req.json();
        const parsed = Schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const response = await ingestUseCase(parsed.data);
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("[/api/ai/ingest]", error);
        return NextResponse.json({ error: "Error al indexar" }, { status: 500 });
    }
}