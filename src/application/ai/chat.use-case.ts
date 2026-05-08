import { ChatRequest, ChatResponse } from "@/src/shared/types/ai.types";
import { ChatMessage } from "@/src/domain/ai/ai.entity";
import { retrieveContext, chat } from "@/src/infrastructure/ai/langchain.client";

export async function chatUseCase(request: ChatRequest): Promise<ChatResponse> {
    const history: ChatMessage[] = (request.conversationHistory ?? []).map(
        (m) => new ChatMessage(m.role, m.content)
    );

    // Busca directamente con el mensaje del usuario — sin reescritura.
    // La reescritura del query anterior introducía errores y latencia extra.
    // nomic-embed-text maneja bien queries en lenguaje natural.
    const context = await retrieveContext(request.message, 5);

    const response = await chat(request.message, history, context);

    return {
        answer: response.answer,
        model:  response.model,
        sources: response.sources.map((s) => ({
            content: s.content,
            source:  s.source,
            score:   s.score,
        })),
    };
}