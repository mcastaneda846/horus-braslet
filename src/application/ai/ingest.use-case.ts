import { IngestRequest, IngestResponse } from "@/src/shared/types/ai.types";
import { ingestMarkdownDocument } from "@/src/infrastructure/ai/langchain.client";

export async function ingestUseCase(request: IngestRequest): Promise<IngestResponse> {
    if (!request.fileName.endsWith(".md")) {
        throw new Error("Solo se aceptan archivos .md");
    }

    if (!request.fileContent?.trim()) {
        throw new Error("El archivo está vacío");
    }

    const { chunksIndexed } = await ingestMarkdownDocument(
        request.fileContent,
        request.fileName
    );

    return { success: true, chunksIndexed, fileName: request.fileName };
}