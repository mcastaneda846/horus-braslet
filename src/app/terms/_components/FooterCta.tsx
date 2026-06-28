"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const linkStyle: React.CSSProperties = {
    fontSize: "13px", fontWeight: 700,
    color: "var(--h-text)", textDecoration: "underline", textUnderlineOffset: "2px",
};

export function FooterCta() {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.json())
            .then(d => setLoggedIn(!!d.loggedIn))
            .catch(() => setLoggedIn(false));
    }, []);

    if (loggedIn === null) return null;
    return loggedIn
        ? <Link href="/dashboard" style={linkStyle}>Volver al perfil</Link>
        : (
            <>
                <Link href="/register" style={linkStyle}>Crear cuenta</Link>
                <Link href="/login" style={linkStyle}>Iniciar sesión</Link>
            </>
        );
}
