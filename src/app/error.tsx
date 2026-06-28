"use client";

import { useEffect } from "react";
import EyeOfHorusIcon from "@/src/components/EyeOfHorusIcon";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Horus Error]", error);
    }, [error]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--h-bg)",
                color: "var(--h-text)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                padding: "24px",
                textAlign: "center",
            }}
        >
            <EyeOfHorusIcon style={{ width: 48, height: 48, opacity: 0.25, marginBottom: 32 }} />

            <p
                style={{
                    fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    fontSize: 96,
                    fontWeight: 700,
                    letterSpacing: "-6px",
                    color: "var(--h-text)",
                    opacity: 0.08,
                    lineHeight: 1,
                    marginBottom: 0,
                    userSelect: "none",
                }}
            >
                500
            </p>

            <h1
                style={{
                    fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.4px",
                    marginTop: -16,
                    marginBottom: 10,
                }}
            >
                Algo salió mal
            </h1>

            <p style={{ fontSize: 14, color: "var(--h-muted)", maxWidth: 340, lineHeight: 1.6, marginBottom: 32 }}>
                Ocurrió un error inesperado. Puedes intentar de nuevo o regresar al inicio.
            </p>

            {error.digest && (
                <p style={{ fontSize: 11, color: "var(--h-muted)", fontFamily: "monospace", marginBottom: 24, background: "var(--h-card)", padding: "4px 10px", borderRadius: 6, border: "1px solid var(--h-border)" }}>
                    ID: {error.digest}
                </p>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    onClick={reset}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--h-dark)",
                        color: "var(--h-gold)",
                        padding: "12px 22px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    }}
                >
                    Intentar de nuevo
                </button>
                <a
                    href="/dashboard"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--h-card)",
                        color: "var(--h-text)",
                        border: "1.5px solid var(--h-border)",
                        padding: "12px 22px",
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    }}
                >
                    Ir al dashboard
                </a>
            </div>

            <p style={{ marginTop: 48, fontSize: 11, color: "var(--h-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                HORUS · Sistema de ID Médica
            </p>
        </div>
    );
}
