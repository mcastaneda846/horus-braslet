import { ChatMessage, AssistantResponse, KnowledgeChunk } from "./ai.entity";

export interface IAiRepository {
    chat(
        message: string,
        history: ChatMessage[],
        context: KnowledgeChunk[]
    ): Promise<AssistantResponse>;

    retrieveContext(query: string, topK?: number): Promise<KnowledgeChunk[]>;

    ingestDocument(
        content: string,
        fileName: string
    ): Promise<{ chunksIndexed: number }>;
}