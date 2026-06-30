"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";


interface NavItem { label: string; href: string; icon: React.ReactNode }

function IconDashboard() {
    return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>;
}
function IconProfile() {
    return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>;
}
function IconFiles() {
    return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /><path d="M2 10h20" /></svg>;
}
function IconTienda() {
    return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
}
function IconLogout() {
    return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function IconSun() {
    return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={4} /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
}
function IconMoon() {
    return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
}

const HIDDEN_ROUTES = ["/login", "/register", "/terms", "/privacy"];
const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutos
const WARN_BEFORE_MS = 90 * 1000;       // avisar 90s antes


export default function FloatingSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    // ── Inactivity state ────────────────────────────────────────────────────
    const [showWarning, setShowWarning] = useState(false);
    const resetRef = useRef<(() => void) | null>(null);

    const isPublicRoute = HIDDEN_ROUTES.some(r => pathname.startsWith(r));

    const doLogout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }, [router]);

    useEffect(() => {
        if (isPublicRoute) return;

        let logoutTimer: ReturnType<typeof setTimeout>;
        let warnTimer: ReturnType<typeof setTimeout>;

        const reset = () => {
            clearTimeout(logoutTimer);
            clearTimeout(warnTimer);
            setShowWarning(false);

            warnTimer = setTimeout(() => {
                setShowWarning(true);
            }, INACTIVITY_MS - WARN_BEFORE_MS);

            logoutTimer = setTimeout(() => {
                doLogout();
            }, INACTIVITY_MS);
        };

        resetRef.current = reset;

        const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"] as const;
        EVENTS.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
        reset();

        return () => {
            EVENTS.forEach(ev => window.removeEventListener(ev, reset));
            clearTimeout(logoutTimer);
            clearTimeout(warnTimer);
        };
    }, [isPublicRoute, doLogout]);

    useEffect(() => { setMounted(true); }, []);

    const items: NavItem[] = useMemo(() => [
        { label: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
        { label: "Perfil", href: "/profile", icon: <IconProfile /> },
        { label: "Archivos", href: "/archivos", icon: <IconFiles /> },
        { label: "Tienda", href: "/tienda", icon: <IconTienda /> },
    ], []);

    if (isPublicRoute) return null;

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    return (
        <>
            {/* ── Aviso de inactividad ──────────────────────────────────────── */}
            {showWarning && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
                }}>
                    <div style={{
                        background: "#191512", border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 24, padding: 32, maxWidth: 360, width: "100%",
                        textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: "50%",
                            background: "rgba(250,217,87,0.12)", border: "2px solid #FAD957",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px", fontSize: 24,
                        }}>⏱</div>
                        <p style={{ color: "#FAD957", fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>
                            Sesión por vencer
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>
                            Tu sesión se cerrará automáticamente por inactividad. Haz clic en <strong style={{ color: "#FAD957" }}>Seguir activo</strong> para continuar.
                        </p>
                        <button
                            onClick={() => resetRef.current?.()}
                            style={{
                                width: "100%", padding: "13px 0", borderRadius: 14,
                                background: "#FAD957", color: "#1A1512",
                                border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
                                marginBottom: 10,
                            }}>
                            Seguir activo
                        </button>
                        <button
                            onClick={doLogout}
                            style={{
                                width: "100%", padding: "13px 0", borderRadius: 14,
                                background: "transparent", color: "rgba(255,255,255,0.4)",
                                border: "1px solid rgba(255,255,255,0.12)", fontSize: 14,
                                fontWeight: 600, cursor: "pointer",
                            }}>
                            Cerrar sesión ahora
                        </button>
                    </div>
                </div>
            )}

            {/* ── Mobile: floating bottom pill bar ──────────────────────────── */}
            <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-[#191512] rounded-[28px] px-3 py-2.5 shadow-2xl border border-white/10">
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} title={item.label}
                            className={`flex items-center justify-center rounded-2xl transition-all duration-300 ease-out
                                ${isActive
                                    ? "bg-[#FAD957] text-[#1A1512] w-14 h-11"
                                    : "text-white/40 hover:text-white/70 hover:bg-white/8 w-11 h-11"}`}>
                            {item.icon}
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-white/15 mx-1" />

                {mounted && (
                    <button onClick={() => setTheme(isDark ? "light" : "dark")}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl text-white/40 hover:text-[#FAD957] hover:bg-white/8 transition-all border-none bg-transparent cursor-pointer">
                        {isDark ? <IconSun /> : <IconMoon />}
                    </button>
                )}

                <Link href="/terms" title="Términos"
                    className="flex items-center justify-center w-11 h-11 rounded-2xl text-white/25 hover:text-white/60 hover:bg-white/8 transition-all">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </Link>

                <button onClick={handleLogout}
                    className="flex items-center justify-center w-11 h-11 rounded-2xl text-white/30 hover:text-red-400 hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent">
                    <IconLogout />
                </button>
            </nav>

            {/* ── Desktop: floating vertical sidebar ───────────────────────── */}
            <aside className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1 bg-[#191512] rounded-[28px] px-2 py-3 shadow-2xl">
                <div className="mb-2 flex items-center justify-center w-10 h-10">
                    <Image src="/logos-horus-1.svg" alt="Horus" width={36} height={36} className="object-contain" />
                </div>

                <div className="w-5 h-px bg-white/10 mb-1" />

                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} title={item.label}
                            className={`relative group flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200
                                ${isActive ? "bg-[#FAD957] text-[#1A1512]" : "text-white/40 hover:text-white/80 hover:bg-white/8"}`}>
                            {item.icon}
                            <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#191512] border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                <div className="w-5 h-px bg-white/10 mt-1 mb-1" />

                {mounted && (
                    <button onClick={() => setTheme(isDark ? "light" : "dark")} title={isDark ? "Modo claro" : "Modo oscuro"}
                        className="group relative w-10 h-10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#FAD957] hover:bg-white/8 transition-all duration-200 border-none bg-transparent cursor-pointer">
                        {isDark ? <IconSun /> : <IconMoon />}
                        <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#191512] border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                            {isDark ? "Modo claro" : "Modo oscuro"}
                        </span>
                    </button>
                )}

                <Link href="/terms" title="Términos y Condiciones"
                    className="group relative w-10 h-10 rounded-2xl flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/8 transition-all duration-200">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="17" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#191512] border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                        Términos
                    </span>
                </Link>

                <button onClick={handleLogout} title="Cerrar sesión"
                    className="group relative w-10 h-10 rounded-2xl flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-white/8 transition-all duration-200 cursor-pointer border-none bg-transparent">
                    <IconLogout />
                    <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#191512] border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                        Cerrar sesión
                    </span>
                </button>
            </aside>
        </>
    );
}
