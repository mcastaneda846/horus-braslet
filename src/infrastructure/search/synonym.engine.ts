import { normalizeText } from "./text.processor";

// Mapa de variantes -> canonical (pequeño y editable)
const VARIANT_TO_CANONICAL: Record<string, string> = {
    // inconsciencia
    "desmayo": "inconsciente",
    "desmayado": "inconsciente",
    "desmayó": "inconsciente",
    "no despierta": "inconsciente",
    "no responde": "inconsciente",
    "sin reaccion": "inconsciente",

    // respiración / cianosis
    "se puso morado": "no respira",
    "morado": "no respira",
    "azulado": "no respira",
    "no respira": "no respira",
    "no respira bien": "no respira",

    // atragantamiento
    "ahogando": "atragantamiento",
    "atragantado": "atragantamiento",
    "no puede hablar": "atragantamiento",

    // cardiaco
    "ataque al corazon": "paro cardiaco",
    "infarto": "paro cardiaco",
    "dolor pecho": "dolor pecho",

    // quemaduras
    "aceite caliente": "quemadura",
    "me quemé": "quemadura",
    "me queme": "quemadura",
    "aceite hirviendo": "quemadura",
};

export function expandWithSynonyms(tokens: string[]): string[] {
    const out = new Set<string>(tokens.map(t => normalizeText(t)));
    for (const t of tokens) {
        const norm = normalizeText(t);
        // buscar variantes que incluyen token as substring
        for (const [variant, canonical] of Object.entries(VARIANT_TO_CANONICAL)) {
            if (variant.includes(norm) || norm.includes(variant)) {
                out.add(normalizeText(canonical));
            }
        }
        // también si exact match in map
        if (VARIANT_TO_CANONICAL[norm]) out.add(normalizeText(VARIANT_TO_CANONICAL[norm]));
    }
    return Array.from(out);
}

// Expande una frase completa: retorna tokens normalizados + sinónimos detectados
export function expandQueryText(query: string): string[] {
    const norm = normalizeText(query);
    const words = norm.split(/\s+/).filter(Boolean);
    const expanded = expandWithSynonyms(words);
    // añadir también frases completas si están mapeadas
    for (const [variant, canonical] of Object.entries(VARIANT_TO_CANONICAL)) {
        if (norm.includes(variant)) expanded.push(normalizeText(canonical));
    }
    return Array.from(new Set(expanded));
}

