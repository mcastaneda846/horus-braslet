export class ChatMessage {
    constructor(
        public readonly role: "human" | "assistant",
        public readonly content: string
    ) {}
}

export class KnowledgeChunk {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly source: string,
        public readonly score: number = 0
    ) {}
}

export class AssistantResponse {
    constructor(
        public readonly answer: string,
        public readonly sources: KnowledgeChunk[],
        public readonly model: string
    ) {}
}