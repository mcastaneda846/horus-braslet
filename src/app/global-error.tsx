"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Horus GlobalError]", error);
    }, [error]);

    return (
        <html lang="es">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    background: "#F2F1EC",
                    color: "#1C1917",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "system-ui, sans-serif",
                    padding: "24px",
                    textAlign: "center",
                }}
            >
                <svg
                    width="48" height="48" viewBox="0 0 48 48" fill="none"
                    style={{ opacity: 0.2, marginBottom: 32 }}
                >
                    <ellipse cx="24" cy="24" rx="20" ry="10" stroke="#1C1917" strokeWidth="2.5" />
                    <circle cx="24" cy="24" r="5" stroke="#1C1917" strokeWidth="2.5" />
                    <line x1="24" y1="4" x2="24" y2="14" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="24" y1="34" x2="24" y2="44" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                <p style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-4px", opacity: 0.08, lineHeight: 1, marginBottom: 0 }}>
                    Error
                </p>

                <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: -12, marginBottom: 10 }}>
                    Error crítico de la aplicación
                </h1>

                <p style={{ fontSize: 14, color: "#8D99AE", maxWidth: 340, lineHeight: 1.6, marginBottom: 32 }}>
                    No se pudo cargar la aplicación. Por favor recarga la página.
                </p>

                <button
                    onClick={reset}
                    style={{
                        background: "#1A1512",
                        color: "#FAD957",
                        padding: "12px 28px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Recargar
                </button>

                <p style={{ marginTop: 48, fontSize: 11, color: "#8D99AE", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    HORUS · Sistema de ID Médica
                </p>
            </body>
        </html>
    );
}
