"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const btnStyle: React.CSSProperties = {
    background: "#FAD957", color: "#1A1512", borderRadius: "100px",
    padding: "8px 20px", fontSize: "13px", fontWeight: 700,
    textDecoration: "none", letterSpacing: "0.01em", whiteSpace: "nowrap",
};

export function NavbarCta() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(document.cookie.includes("access_token"));
    }, []);

    return loggedIn
        ? <Link href="/dashboard" style={btnStyle}>Volver a la app</Link>
        : <Link href="/register" style={btnStyle}>Crear cuenta</Link>;
}
