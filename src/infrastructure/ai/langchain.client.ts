import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { ollamaLLM } from "./ollama.client";
import { searchChunks, upsertDocuments } from "./pinecone.client";
import { KnowledgeChunk, ChatMessage, AssistantResponse } from "@/src/domain/ai/ai.entity";

const FALLBACK_EMERGENCY = "No tengo información suficiente del manual para responder con precisión. Llama al 123 si es una emergencia.\n\nEsta información es orientativa. Ante cualquier emergencia llama al 123.";
const FALLBACK_OUT_OF_SCOPE = "Solo puedo ayudar con primeros auxilios y emergencias médicas. Si tienes una emergencia real, llama al 123.\n\nEsta información es orientativa. Ante cualquier emergencia llama al 123.";
const FALLBACK_MEDICATION_BLOCKED = "No puedo recomendar medicamentos ni dosis.\n1. Llama al 123 si hay dolor intenso, dificultad para respirar o empeora\n2. Mantén a la persona en reposo y en una posición cómoda\n3. Afloja ropa ajustada y vigila respiración y consciencia\n\nEsta información es orientativa. Ante cualquier emergencia llama al 123.";

const FORBIDDEN_RECOMMENDATION_PATTERNS = [
    /\baspirina\b/i,
    /\bibuprofeno\b/i,
    /\bparacetamol\b/i,
    /\bacetaminofen\b/i,
    /\bnaproxeno\b/i,
    /\bdiclofenaco\b/i,
    /\bamoxicilina\b/i,
    /\bmg\b/i,
    /\bmiligramos?\b/i,
    /\bdosis\b/i,
    /\bmedicamentos?\b/i,
    /\btabletas?\b/i,
    /\bcapsulas?\b/i,
];

const FIRST_AID_KEYWORDS = [
    "primeros auxilios", "emergencia", "urgencia", "accidente", "inconsciente", "desmayo",
    "convulsion", "sangrado", "hemorrag", "quemadura", "fractura", "herida", "caida",
    "atragant", "ahog", "respira", "respiracion", "rcp", "reanimacion", "pulso",
    "paro", "pecho", "dolor", "alerg", "anafil", "picadura", "intoxic", "electroc",
    "golpe", "trauma", "fiebre", "vomito", "diarrea", "mareo", "botiquin",
    "cayo", "cae", "caerse", "brazo", "chuec", "deform", "hincha", "llora",
    "nino", "nina", "bebe", "menor"
];

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function isLikelyFirstAidText(value: string): boolean {
    const normalized = normalizeText(value);
    return FIRST_AID_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function containsForbiddenRecommendation(value: string): boolean {
    return FORBIDDEN_RECOMMENDATION_PATTERNS.some((pattern) => pattern.test(value));
}

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
- No recomiendes medicamentos, dosis, productos, marcas ni tratamientos
- Si la pregunta NO es de primeros auxilios o emergencia médica, responde exactamente: "Solo puedo ayudar con primeros auxilios y emergencias médicas. Si tienes una emergencia real, llama al 123."
- Usa el historial solo para continuidad de primeros auxilios; ignora turnos fuera de tema
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
    if (!isLikelyFirstAidText(message)) {
        return new AssistantResponse(
            FALLBACK_OUT_OF_SCOPE,
            context,
            process.env.OLLAMA_MODEL ?? "llama3.1:8b"
        );
    }

    // Si no hay contexto relevante del manual, evita recomendaciones sin respaldo
    if (context.length === 0) {
        return new AssistantResponse(
            FALLBACK_EMERGENCY,
            context,
            process.env.OLLAMA_MODEL ?? "llama3.1:8b"
        );
    }

    const contextText = context.length > 0
        ? context.map((c) => c.content).join("\n\n---\n\n")
        : "";

    // Historial solo si existe, para no contaminar el prompt con texto vacío
    const relevantHistory = history
        .filter((m) => isLikelyFirstAidText(m.content))
        .slice(-6);

    const historyText = relevantHistory.length > 0
        ? relevantHistory
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

    const safeAnswer = containsForbiddenRecommendation(answer)
        ? FALLBACK_MEDICATION_BLOCKED
        : answer.trim();

    return new AssistantResponse(
        safeAnswer,
        context,
        process.env.OLLAMA_MODEL ?? "llama3.1:8b"
    );
}