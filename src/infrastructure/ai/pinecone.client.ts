// src/infrastructure/ai/pinecone.client.ts

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { ollamaEmbeddings } from "./ollama.client";

const API_KEY = process.env.PINECONE_API_KEY!;
const INDEX   = process.env.PINECONE_INDEX ?? "first-aid-assistant";

if (!API_KEY) throw new Error("Falta PINECONE_API_KEY");

let _client: Pinecone | null = null;

function getClient(): Pinecone {
    if (!_client) _client = new Pinecone({ apiKey: API_KEY });
    return _client;
}

export async function getStore(): Promise<PineconeStore> {
    const index = getClient().Index(INDEX);
    return PineconeStore.fromExistingIndex(ollamaEmbeddings, {
        pineconeIndex: index,
    });
}

export async function searchChunks(
    query: string,
    topK: number = 5,
    minScore: number = 0.5
) {
    const store   = await getStore();
    const results = await store.similaritySearchWithScore(query, topK);
    return results
        .filter(([_, score]) => score >= minScore)
        .sort(([_, a], [__, b]) => b - a);
}

/**
 * Upsert manual — bypasea @langchain/pinecone para evitar bugs con pinecone v5.
 * Filtra metadata compleja (objetos anidados como 'loc') que Pinecone rechaza.
 */
export async function upsertDocuments(docs: Document[]) {
    const index = getClient().Index(INDEX);
    const BATCH = 50;

    for (let i = 0; i < docs.length; i += BATCH) {
        const batch   = docs.slice(i, i + BATCH);
        const texts   = batch.map((d) => d.pageContent);
        const vectors = await ollamaEmbeddings.embedDocuments(texts);

        const records = batch.map((doc, idx) => ({
            id:     `doc-${Date.now()}-${i + idx}`,
            values: vectors[idx],
            metadata: {
                // Solo tipos primitivos — Pinecone rechaza objetos anidados
                text:   doc.pageContent,
                source: (doc.metadata.source as string) ?? "manual",
            },
        }));

        await index.upsert(records);

        console.log(
            `[Pinecone] Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(docs.length / BATCH)} — ${records.length} vectores subidos`
        );
    }
}