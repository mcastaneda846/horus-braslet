import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { ollamaLLM } from "./ollama.client";
import { searchChunks, upsertDocuments } from "./pinecone.client";
import { KnowledgeChunk, ChatMessage, AssistantResponse } from "@/src/domain/ai/ai.entity";

// Prompt
//
// Diseño del prompt:
// 1. Rol claro y acotado
// 2. Reglas cortas y directas — el modelo las sigue mejor
// 3. El contexto va ANTES de la pregunta — mejora la recuperación
// 4. Formato de salida definido explícitamente
// 5. Disclaimer fijo al final

const PROMPT = PromptTemplate.fromTemplate(`Eres un asistente de primeros auxilios. Das instrucciones claras, cortas y directas sobre qué hacer en una emergencia médica.

REGLAS:
- Solo hablas de primeros auxilios
- Máximo 5 pasos, numerados, cortos
- Lenguaje simple — como si le hablaras a alguien asustado
- Si es grave, el primer paso siempre es "Llama al 123"
- No menciones síntomas ni diagnósticos, solo acciones
- No menciones de dónde sacas la información
- Termina siempre con la línea del aviso

INFORMACIÓN DEL MANUAL:
{context}

{history}PREGUNTA: {question}

RESPUESTA (pasos numerados, luego el aviso en nueva línea):

---
Esta información es orientativa. Ante cualquier emergencia llama al 123.`);

// Ingesta

export async function ingestMarkdownDocument(
    content: string,
    fileName: string
): Promise<{ chunksIndexed: number }> {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
        chunkSize:    2000,
        chunkOverlap: 400,
    });

    const docs: Document[] = await splitter.createDocuments(
        [content],
        [{ source: fileName, indexedAt: new Date().toISOString() }]
    );

    if (docs.length === 0) {
        throw new Error("El splitter no generó ningún chunk — verifica que el archivo no esté vacío");
    }

    await upsertDocuments(docs);

    console.log(`[Ingest] ${docs.length} chunks indexados de "${fileName}"`);
    return { chunksIndexed: docs.length };
}

// Recuperación

export async function retrieveContext(
    query: string,
    topK: number = 5
): Promise<KnowledgeChunk[]> {
    const results = await searchChunks(query, topK, 0.5);

    return results.map(([doc, score], idx) =>
        new KnowledgeChunk(
            `chunk-${idx}`,
            doc.pageContent,
            (doc.metadata.source as string) ?? "manual",
            score
        )
    );
}

// Chat

export async function chat(
    message: string,
    history: ChatMessage[],
    context: KnowledgeChunk[]
): Promise<AssistantResponse> {
    // Si no hay contexto relevante del manual, igual responde — el modelo
    // conoce primeros auxilios de su entrenamiento base
    const contextText = context.length > 0
        ? context.map((c) => c.content).join("\n\n---\n\n")
        : "";

    // Historial solo si existe, para no contaminar el prompt con texto vacío
    const historyText = history.length > 0
        ? history
        .map((m) => `${m.role === "human" ? "Usuario" : "Asistente"}: ${m.content}`)
        .join("\n") + "\n\n"
        : "";

    const chain = RunnableSequence.from([
        PROMPT,
        ollamaLLM,
        new StringOutputParser(),
    ]);

    const answer = await chain.invoke({
        context:  contextText,
        history:  historyText,
        question: message,
    });

    return new AssistantResponse(
        answer.trim(),
        context,
        process.env.OLLAMA_MODEL ?? "llama3.1:8b"
    );
}