import type { Protocol } from "@/src/domain/first-aid/protocol.entity";

export interface SearchResult {
    protocol: Protocol;
    score:    number;
}

export type CategoryType = "cardiac" | "respiratory" | "trauma" | "burn" | "poisoning" | "other";
