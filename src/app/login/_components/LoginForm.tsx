"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/Spinner";

function EyeIcon({ open }: { open: boolean }) {
    return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="#C4BDB7">
            {open ? (
                <>
                    <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke="#C4BDB7" />
                    <circle cx="12" cy="12" r="2.5" fill="#C4BDB7" stroke="none" />
                </>
            ) : (
                <>
                    <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke="#C4BDB7" />
                    <circle cx="12" cy="12" r="2.5" fill="#C4BDB7" stroke="none" />
                    <line x1="4" y1="20" x2="20" y2="4" stroke="#C4BDB7" strokeWidth={1.6} strokeLinecap="round" />
                </>
            )}
        </svg>
    );
}

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = "El correo es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Formato inválido";
        if (!password) errs.password = "La contraseña es requerida";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) router.push("/dashboard");
            else {
                const d = await res.json();
                setErrors({ general: d.message || "Correo o contraseña incorrectos" });
            }
        } catch {
            setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {errors.general && (
                <div style={{
                    background: "#FEF2F2", borderRadius: "14px",
                    padding: "10px 16px", color: "#DC2626",
                    fontSize: "12px", fontWeight: 600,
                }}>
                    {errors.general}
                </div>
            )}

            {/* ── Campo Correo ── */}
            <div>
                <div style={{
                    background: "var(--h-card)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "9px 16px 10px",
                    boxShadow: errors.email
                        ? "0 0 0 1.5px #EF4444, 0 2px 8px rgba(0,0,0,0.05)"
                        : "0 2px 10px rgba(0,0,0,0.07), 0 0 0 1px var(--h-border)",
                    display: "flex", flexDirection: "column", gap: "2px",
                }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#A8A09A", letterSpacing: "0.02em" }}>
                        Correo
                    </label>
                    <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                        autoComplete="email"
                        style={{
                            background: "transparent", border: "none", outline: "none",
                            fontSize: "15px", fontWeight: 700, color: "#1A1512",
                            fontFamily: "inherit", padding: 0,
                        }}
                    />
                </div>
                {errors.email && <p style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600, marginTop: "4px", paddingLeft: "6px" }}>{errors.email}</p>}
            </div>

            {/* ── Campo Contraseña ── */}
            <div>
                <div style={{
                    background: "var(--h-card)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "9px 16px 10px",
                    boxShadow: errors.password
                        ? "0 0 0 1.5px #EF4444, 0 2px 8px rgba(0,0,0,0.05)"
                        : "0 2px 10px rgba(0,0,0,0.07), 0 0 0 1px var(--h-border)",
                    display: "flex", flexDirection: "column", gap: "2px",
                }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#A8A09A", letterSpacing: "0.02em" }}>
                        Contraseña
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                            autoComplete="current-password"
                            style={{
                                flex: 1, background: "transparent", border: "none", outline: "none",
                                fontSize: "15px", fontWeight: 700, color: "var(--h-text)",
                                fontFamily: "inherit", padding: 0,
                            }}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                            <EyeIcon open={showPw} />
                        </button>
                    </div>
                </div>
                {errors.password && <p style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600, marginTop: "4px", paddingLeft: "6px" }}>{errors.password}</p>}
            </div>

            {/* ¿Olvidaste? */}
            <div style={{ textAlign: "right", marginTop: "-2px" }}>
                <a href="#" style={{ fontSize: "12px", fontWeight: 500, color: "#A8A09A", textDecoration: "none" }}>
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            {/* Botón negro */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    background: "var(--h-dark)",
                    color: "var(--h-bg)",
                    border: "none",
                    borderRadius: "100px",
                    padding: "15px 24px",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "4px",
                    letterSpacing: "0.01em",
                    boxShadow: "0 4px 20px rgba(26,21,18,0.25)",
                    transition: "opacity 0.15s, transform 0.1s",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
                {loading ? (
                    <><Spinner size={16} />&nbsp;Iniciando...</>
                ) : "Iniciar sesión"}
            </button>
        </form>
    );
}
