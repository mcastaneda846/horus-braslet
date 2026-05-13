import type { ProtocolRepository } from "@/src/domain/first-aid/protocol.repository";
import { fuseSearch }              from "@/src/infrastructure/search/fuse.search";
import { semanticSearch }          from "@/src/infrastructure/search/semantic.search";
import type { SearchResult }       from "@/src/shared/types/first-aid.types";

export async function searchProtocolsUseCase(
    repository: ProtocolRepository,
    query: string
): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    // Si no está inicializado, lo hacemos desde el repo
    const protocols = await repository.getAll();
    // inicializar ambos motores (Fuse + semántico híbrido)
    fuseSearch.initialize(protocols);
    semanticSearch.initialize(protocols);

    // usar motor semántico híbrido que combina Fuse + scoring manual
    return semanticSearch.search(query);
}

export async function getProtocolsByCategoryUseCase(
    repository: ProtocolRepository,
    category:   string
) {
    return repository.getByCategory(category);
}

export async function getAllProtocolsUseCase(
    repository: ProtocolRepository
) {
    return repository.getAll();
}