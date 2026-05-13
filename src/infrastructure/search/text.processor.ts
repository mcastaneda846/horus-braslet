// Normalización y tokenización ligera para búsqueda en español
export function normalizeText(input: string): string {
    return input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/[^a-z0-9\s]/g, " ")   // quitar caracteres especiales
        .replace(/\s+/g, " ")
        .trim();
}

const STOP_WORDS = new Set([
    "y","o","el","la","los","las","de","del","que","un","una","unos","unas",
    "mi","me","se","al","por","para","con","sin","no","esta","está","es","son",
    "su","sus","le","les","lo","como","en","a","al","ha","hay","si","te","tu","su",
]);

// Heurística ligera de stemming: elimina sufijos comunes en español
function stemToken(t: string): string {
    const suffixes = ["mente","ación","aciones","mente","imiento","imientos","anza","anza","es","s","ando","iendo","ado","ido","ar","er","ir"];
    for (const suf of suffixes) {
        if (t.length > suf.length + 2 && t.endsWith(suf)) {
            return t.slice(0, -suf.length);
        }
    }
    return t;
}

export function tokenize(input: string): string[] {
    const norm = normalizeText(input);
    const parts = norm.split(" ").map(p => p.trim()).filter(Boolean);
    const tokens: string[] = [];
    for (const p of parts) {
        if (STOP_WORDS.has(p)) continue;
        const stemmed = stemToken(p);
        tokens.push(stemmed);
    }
    // devolver tokens únicos
    return Array.from(new Set(tokens));
}

// Comprueba si una frase (ya normalizada) contiene alguna de las palabras/phrases objetivo
export function containsAny(normalizedText: string, targets: string[] | undefined): boolean {
    if (!targets || targets.length === 0) return false;
    const text = normalizeText(normalizedText);
    for (const t of targets) {
        const nt = normalizeText(t);
        if (text.includes(nt)) return true;
    }
    return false;
}

