import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatUseCase } from "@/src/application/ai/chat.use-case";

const Schema = z.object({
    message: z.string().min(1).max(1000),
    conversationHistory: z
        .array(z.object({
            role:    z.enum(["human", "assistant"]),
            content: z.string(),
        }))
        .optional()
        .default([]),
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

        const response = await chatUseCase(parsed.data);
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("[/api/ai/chat]", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}