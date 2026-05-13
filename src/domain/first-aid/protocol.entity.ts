export type Severity = "critical" | "urgent" | "mild";

export interface ProtocolStep {
    id:          number;
    instruction: string;
    duration?:   number;  // segundos — si tiene temporizador
    warning?:    string;  // advertencia específica del paso
    imageUrl?:   string;
}

export interface DecisionNode {
    id:       string;
    question: string;
    yes:      string | ProtocolStep[]; // ID del siguiente nodo o pasos finales
    no:       string | ProtocolStep[];
}

export interface Protocol {
    id:           string;
    title:        string;
    severity:     Severity;
    category:     string;
    keywords:     string[];
    symptoms:     string[];
    steps:        ProtocolStep[];
    warnings:     string[];
    decisionTree?: DecisionNode[];  // opcional — solo protocolos complejos
    callEmergency: boolean;          // si debe llamar al 123
    estimatedTime?: number;          // minutos estimados
    // Nuevos campos para mejorar búsqueda y matching
    priorityKeywords?: string[];    // palabras clave de alta prioridad
    aliases?: string[];             // títulos o frases alternativas
    emergencyTriggers?: string[];   // frases/síntomas que indican emergencia inmediata
    synonyms?: string[];            // sinónimos específicos del protocolo
    contraindications?: string[];   // advertencias específicas que anulan acciones
    targetAge?: { min?: number; max?: number };
}