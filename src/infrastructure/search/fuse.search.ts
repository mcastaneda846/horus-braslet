import Fuse, { type IFuseOptions } from "fuse.js";
import type { Protocol }      from "@/src/domain/first-aid/protocol.entity";
import type { SearchResult }  from "@/src/shared/types/first-aid.types";

// Configuración de Fuse.js optimizada para búsqueda médica
const FUSE_OPTIONS: IFuseOptions<Protocol> = {
    threshold:          0.4,    // 0 = exacto, 1 = cualquier cosa — 0.4 permite typos leves
    distance:           100,    // distancia máxima entre caracteres
    minMatchCharLength: 2,      // mínimo 2 caracteres para buscar
    includeScore:       true,   // incluye score de relevancia
    useExtendedSearch:  false,

    // Campos donde buscar y su peso (mayor = más importante)
    keys: [
        { name: "title",    weight: 0.4 },
        { name: "keywords", weight: 0.35 },
        { name: "symptoms", weight: 0.25 },
    ],
};

export class FuseSearch {
    private fuse: Fuse<Protocol> | null = null;

    // Inicializa el índice con los protocolos
    initialize(protocols: Protocol[]): void {
        this.fuse = new Fuse(protocols, FUSE_OPTIONS);
    }

    // Busca protocolos por query
    search(query: string): SearchResult[] {
        if (!this.fuse || !query.trim()) return [];

        const results = this.fuse.search(query.trim());

        return results.map((result) => ({
            protocol: result.item,
            score:    1 - (result.score ?? 0), // invertir score: 1 = más relevante
        }));
    }

    // Búsqueda por categoría (sin Fuse — directa)
    filterByCategory(protocols: Protocol[], category: string): Protocol[] {
        return protocols.filter((p) => p.category === category);
    }

    // Búsqueda por severidad
    filterBySeverity(protocols: Protocol[], severity: string): Protocol[] {
        return protocols.filter((p) => p.severity === severity);
    }
}

// Singleton para reutilizar el índice
export const fuseSearch = new FuseSearch();