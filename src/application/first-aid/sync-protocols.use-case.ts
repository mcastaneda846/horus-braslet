import type { ProtocolRepository } from "@/src/domain/first-aid/protocol.repository";
import { PROTOCOLS }               from "@/src/shared/data/protocols.data";

export async function syncProtocolsUseCase(
    repository: ProtocolRepository
): Promise<void> {
    const count = await repository.count();
    
    // Si la DB está vacía o hay discrepancia, sincronizamos
    // En una app real podríamos comparar versiones, aquí simplificamos
    if (count === 0) {
        await repository.saveAll(PROTOCOLS);
    }
}
