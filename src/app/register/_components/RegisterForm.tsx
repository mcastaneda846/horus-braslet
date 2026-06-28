"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/src/components/Spinner";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
}
type FormErrors = Partial<Record<keyof FormState | "general", string>>;

function getStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "", color: "#E8E4DE" };
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    return [
        { score: 1, label: "Muy débil",  color: "#EF4444" },
        { score: 2, label: "Débil",      color: "#F97316" },
        { score: 3, label: "Buena",      color: "#FAD957" },
        { score: 4, label: "Fuerte",     color: "#96C979" },
    ][Math.max(s - 1, 0)];
}

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

const cardStyle: React.CSSProperties = {
    background: "var(--h-card)",
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    padding: "9px 16px 10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07), 0 0 0 1px var(--h-border)",
    border: "none",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
};
const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "#A09890",
    fontFamily: "inherit",
    letterSpacing: "0.02em",
};
const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--h-text)",
    fontFamily: "inherit",
    padding: 0,
    width: "100%",
};

function Field({
    label, name, type, placeholder, value, onChange, onBlur, error, suffix, autoComplete,
}: {
    label: string; name: string; type: string; placeholder: string;
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void; error?: string; suffix?: React.ReactNode; autoComplete?: string;
}) {
    return (
        <div>
            <div style={{ ...cardStyle, ...(error ? { boxShadow: "0 0 0 1.5px #EF4444, 0 2px 8px rgba(0,0,0,0.05)" } : {}) }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                        name={name} type={type} placeholder={placeholder}
                        value={value} onChange={onChange} onBlur={onBlur}
                        autoComplete={autoComplete}
                        style={{ ...inputStyle, flex: 1 }}
                    />
                    {suffix}
                </div>
            </div>
            {error && (
                <p style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600, marginTop: "4px", paddingLeft: "6px" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default function RegisterForm() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", termsAccepted: false });
    const [errors, setErrors] = useState<FormErrors>({});
    const [emailTouched, setEmailTouched] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        setErrors(p => ({ ...p, [name]: undefined }));
    }

    function validate(): FormErrors {
        const e: FormErrors = {};
        if (!form.firstName.trim()) e.firstName = "El nombre es requerido";
        if (!form.lastName.trim()) e.lastName = "El apellido es requerido";
        if (!form.email.trim()) e.email = "El correo es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Formato inválido";
        if (!form.password) e.password = "La contraseña es requerida";
        else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
        if (!form.confirmPassword) e.confirmPassword = "Confirma tu contraseña";
        else if (form.password !== form.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
        if (!form.termsAccepted) e.termsAccepted = "Debes aceptar los términos y condiciones";
        return e;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEmailTouched(true);
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, termsAccepted: form.termsAccepted }),
            });
            if (res.ok) router.push("/dashboard");
            else {
                const d = await res.json();
                setErrors({ general: d.message || "Error al registrarse" });
            }
        } catch {
            setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
        } finally {
            setLoading(false);
        }
    }

    const { score, label: strengthLabel, color: strengthColor } = getStrength(form.password);
    const confirmMatch = form.confirmPassword ? form.password === form.confirmPassword : null;

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {errors.general && (
                <div style={{ background: "#FEF2F2", borderRadius: "16px", padding: "12px 18px", color: "#DC2626", fontSize: "13px", fontWeight: 600 }}>
                    {errors.general}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="Nombre" name="firstName" type="text" placeholder="Tu nombre"
                    value={form.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
                <Field label="Apellido" name="lastName" type="text" placeholder="Tu apellido"
                    value={form.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" />
            </div>

            <Field
                label="Correo" name="email" type="email" placeholder="tu@correo.com"
                value={form.email} onChange={handleChange}
                onBlur={() => setEmailTouched(true)}
                error={errors.email}
                autoComplete="email"
                suffix={emailTouched && form.email && !errors.email ? (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#96C979" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                ) : undefined}
            />

            <div>
                <Field
                    label="Contraseña" name="password"
                    type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={form.password} onChange={handleChange} error={errors.password}
                    autoComplete="new-password"
                    suffix={
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, flexShrink: 0 }}>
                            <EyeIcon open={showPw} />
                        </button>
                    }
                />
                {form.password && (
                    <div style={{ marginTop: "8px", paddingLeft: "4px" }}>
                        <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    flex: 1, height: "4px", borderRadius: "99px",
                                    background: i <= score ? strengthColor : "#E4E0D9",
                                    transition: "background 0.3s",
                                }} />
                            ))}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: strengthColor }}>{strengthLabel}</span>
                    </div>
                )}
            </div>

            <Field
                label="Confirmar contraseña" name="confirmPassword"
                type={showConfirm ? "text" : "password"} placeholder="••••••••"
                value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
                autoComplete="new-password"
                suffix={
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                        {confirmMatch === true && (
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#96C979" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        )}
                        {confirmMatch === false && (
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        )}
                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                            <EyeIcon open={showConfirm} />
                        </button>
                    </div>
                }
            />

            {/* Terms checkbox */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                    <div style={{ position: "relative", flexShrink: 0, marginTop: "1px" }}>
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={form.termsAccepted}
                            onChange={handleChange}
                            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                        />
                        <div style={{
                            width: "18px", height: "18px", borderRadius: "5px",
                            background: form.termsAccepted ? "#1A1512" : "var(--h-card)",
                            border: errors.termsAccepted ? "1.5px solid #EF4444" : `1.5px solid ${form.termsAccepted ? "#1A1512" : "var(--h-border)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                        }}>
                            {form.termsAccepted && (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FAD957" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--h-muted)", fontWeight: 500, lineHeight: "1.4" }}>
                        He leído y acepto los{" "}
                        <Link href="/terms" target="_blank" style={{ color: "var(--h-text)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            Términos y Condiciones
                        </Link>
                        {" "}y la{" "}
                        <Link href="/privacy" target="_blank" style={{ color: "var(--h-text)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            Política de Privacidad
                        </Link>
                    </span>
                </label>
                {errors.termsAccepted && (
                    <p style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600, paddingLeft: "28px" }}>
                        {errors.termsAccepted}
                    </p>
                )}
            </div>

            <div style={{ height: "8px" }} />

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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "4px",
                    letterSpacing: "0.01em",
                    transition: "opacity 0.15s, transform 0.1s",
                    opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
                {loading ? (
                    <><Spinner size={16} />&nbsp;Creando cuenta...</>
                ) : "Crear cuenta"}
            </button>
        </form>
    );
}
