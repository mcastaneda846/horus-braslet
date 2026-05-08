import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";

const BASE_URL    = process.env.OLLAMA_BASE_URL   ?? "http://localhost:11434";
const LLM_MODEL   = process.env.OLLAMA_MODEL      ?? "llama3.1:8b";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

/**
 * LLM — llama3.1:8b
 * - 128K context window
 * - Mejor razonamiento que 3.2:3b
 * - temperature 0 = respuestas deterministas y precisas para emergencias
 * - keep_alive 30m = evita recargar el modelo entre requests
 */
export const ollamaLLM = new Ollama({
    baseUrl:     BASE_URL,
    model:       LLM_MODEL,
    temperature: 0,
    keepAlive:   "30m",
    numCtx:      4096,
});

/**
 * Embeddings — nomic-embed-text
 * - 768 dimensiones
 * - 274MB
 * - Hasta 8192 tokens por chunk
 */
export const ollamaEmbeddings = new OllamaEmbeddings({
    baseUrl: BASE_URL,
    model:   EMBED_MODEL,
});

export async function checkOllamaHealth(): Promise<{
    ok: boolean;
    hasLLM: boolean;
    hasEmbed: boolean;
}> {
    try {
        const res  = await fetch(`${BASE_URL}/api/tags`);
        const data = (await res.json()) as { models?: { name: string }[] };
        const list = data.models?.map((m) => m.name) ?? [];

        const hasLLM   = list.some((m) => m.includes(LLM_MODEL.split(":")[0]));
        const hasEmbed = list.some((m) => m.includes(EMBED_MODEL.split(":")[0]));

        return { ok: hasLLM && hasEmbed, hasLLM, hasEmbed };
    } catch {
        return { ok: false, hasLLM: false, hasEmbed: false };
    }
}