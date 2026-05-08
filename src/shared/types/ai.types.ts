// src/shared/types/ai.types.ts

export interface ChatRequest {
    message: string;
    conversationHistory?: ConversationMessage[];
}

export interface ChatResponse {
    answer: string;
    sources: SourceChunk[];
    model: string;
}

export interface IngestRequest {
    fileName: string;    // .md obligatorio
    fileContent: string; // texto plano markdown
}

export interface IngestResponse {
    success: boolean;
    chunksIndexed: number;
    fileName: string;
}

export interface ConversationMessage {
    role: "human" | "assistant";
    content: string;
}

export interface SourceChunk {
    content: string;
    source: string;
    score?: number;
}