import type { Protocol } from "@/src/domain/first-aid/protocol.entity";

export interface ProtocolRepository {
    getAll(): Promise<Protocol[]>;
    getById(id: string): Promise<Protocol | null>;
    getByCategory(category: string): Promise<Protocol[]>;
    saveAll(protocols: Protocol[]): Promise<void>;
    count(): Promise<number>;
}
