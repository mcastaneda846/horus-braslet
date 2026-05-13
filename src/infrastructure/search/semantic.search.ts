import type { Protocol } from "@/src/domain/first-aid/protocol.entity";
import type { SearchResult } from "@/src/shared/types/first-aid.types";
import { fuseSearch } from "./fuse.search";
import { tokenize, normalizeText, containsAny } from "./text.processor";
import { expandWithSynonyms, expandQueryText } from "./synonym.engine";

// Pesos de scoring — ajustar según pruebas
const WEIGHTS = {
    fuse: 0.6,
    exactTitle: 1.0,
    priorityKeyword: 0.6,
    symptom: 0.35,
    emergencyTrigger: 1.2,
    severityCriticalBoost: 0.8,
};

export class SemanticSearch {
    private protocols: Protocol[] = [];

    initialize(protocols: Protocol[]) {
        this.protocols = protocols;
        fuseSearch.initialize(protocols);
    }

    // Extrae conteo de coincidencias de síntomas y palabras clave
    private countMatches(normalizedTokens: string[], targets: string[] | undefined): number {
        if (!targets || targets.length === 0) return 0;
        const set = new Set(normalizedTokens.map(t => normalizeText(t)));
        let matches = 0;
        for (const t of targets) {
            const nt = normalizeText(t);
            if (set.has(nt) || normalizedTokens.some(tok => nt.includes(tok) || tok.includes(nt))) matches++;
        }
        return matches;
    }

    async search(query: string): Promise<SearchResult[]> {
        const q = query.trim();
        if (!q) return [];

        // tokens y sinónimos
        const tokens = tokenize(q);
        const expanded = expandWithSynonyms(tokens.concat(expandQueryText(q)));

        // obtener resultados base de Fuse
        const fuseResults = fuseSearch.search(q);
        const baseMap = new Map<string, number>();
        for (const r of fuseResults) baseMap.set(r.protocol.id, r.score);

        const results: SearchResult[] = [];

        for (const proto of this.protocols) {
            // base fuse score (0..1) — si no existe, usar 0.25 si hay coincidencias mínimas
            const base = baseMap.get(proto.id) ?? 0;

            // normalizar y contar
            const symptomMatches = this.countMatches(expanded, proto.symptoms);
            const keywordMatches = this.countMatches(expanded, proto.keywords);
            const priorityMatches = this.countMatches(expanded, proto.priorityKeywords);
            const aliasMatches = this.countMatches(expanded, proto.aliases);

            // emergency triggers stärk
            let emergencyMatches = 0;
            if (proto.emergencyTriggers && proto.emergencyTriggers.length) {
                for (const t of proto.emergencyTriggers) {
                    const nt = normalizeText(t);
                    if (expanded.some(e => nt.includes(e) || e.includes(nt))) emergencyMatches++;
                }
            }

            // exact title match
            const exactTitle = normalizeText(proto.title);
            const qnorm = normalizeText(q);
            const exactTitleMatch = qnorm.includes(exactTitle) || exactTitle.includes(qnorm) ? 1 : 0;

            // severity boost
            const severityBoost = proto.severity === "critical" ? WEIGHTS.severityCriticalBoost : 0;

            // combinar score
            let score = 0;
            score += WEIGHTS.fuse * base; // fuse base
            score += WEIGHTS.priorityKeyword * Math.min(1, priorityMatches);
            score += WEIGHTS.symptom * Math.min(1, symptomMatches / 2);
            score += WEIGHTS.emergencyTrigger * Math.min(1, emergencyMatches);
            score += WEIGHTS.exactTitle * exactTitleMatch * 0.8;
            score += severityBoost;

            // small bump if alias matched
            if (aliasMatches > 0) score += 0.2;

            // small bump if keywords matched
            score += Math.min(0.5, keywordMatches * 0.1);

            // penalizar si no hay coincidencias en tokens ni fuse
            if (base === 0 && symptomMatches === 0 && priorityMatches === 0 && emergencyMatches === 0 && aliasMatches === 0 && keywordMatches === 0) {
                // ignore unrelated protocols
                continue;
            }

            // clamp
            const finalScore = Math.max(0, Math.min(1.5, score));

            results.push({ protocol: proto, score: finalScore });
        }

        // ordenar desc por score
        results.sort((a, b) => b.score - a.score);

        return results;
    }
}

export const semanticSearch = new SemanticSearch();

