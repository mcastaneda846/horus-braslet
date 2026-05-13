import type { Protocol }           from "@/src/domain/first-aid/protocol.entity";
import type { ProtocolRepository } from "@/src/domain/first-aid/protocol.repository";
import {
    dbGetAll,
    dbGetById,
    dbGetByIndex,
    dbPutMany,
    dbCount
} from "@/src/infrastructure/db/indexeddb.client";

const STORE_NAME = "protocols";

export class IndexedDBProtocolRepository implements ProtocolRepository {
    async getAll(): Promise<Protocol[]> {
        return dbGetAll<Protocol>(STORE_NAME);
    }

    async getById(id: string): Promise<Protocol | null> {
        return dbGetById<Protocol>(STORE_NAME, id);
    }

    async getByCategory(category: string): Promise<Protocol[]> {
        return dbGetByIndex<Protocol>(STORE_NAME, "category", category);
    }

    async saveAll(protocols: Protocol[]): Promise<void> {
        return dbPutMany<Protocol>(STORE_NAME, protocols);
    }

    async count(): Promise<number> {
        return dbCount(STORE_NAME);
    }
}
