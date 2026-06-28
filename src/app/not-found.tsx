import Link from "next/link";
import EyeOfHorusIcon from "@/src/components/EyeOfHorusIcon";

export default function NotFound() {
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
                404
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
                Página no encontrada
            </h1>

            <p style={{ fontSize: 14, color: "var(--h-muted)", maxWidth: 320, lineHeight: 1.6, marginBottom: 32 }}>
                La ruta que buscas no existe o fue movida. Verifica la URL o regresa al inicio.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <Link
                    href="/dashboard"
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
                        textDecoration: "none",
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    }}
                >
                    Ir al dashboard
                </Link>
                <Link
                    href="/login"
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
                    Iniciar sesión
                </Link>
            </div>

            <p style={{ marginTop: 48, fontSize: 11, color: "var(--h-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                HORUS · Sistema de ID Médica
            </p>
        </div>
    );
}
