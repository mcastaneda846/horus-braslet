"use client";

import { useEffect, useState } from "react";

export default function ConnectedBadge() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/devices")
            .then(r => r.json())
            .then(d => {
                const devices  = (d.userDevices ?? []).length;
                const sessions = (d.sessions  ?? []).length;
                setCount(devices + sessions);
            })
            .catch(() => setCount(0));
    }, []);

    const connected = count !== null && count > 0;
    const dotColor  = connected ? "bg-[#96C979] animate-pulse" : "bg-[#8D99AE]";
    const label     = count === null
        ? "Cargando..."
        : connected
            ? `${count} producto${count > 1 ? "s" : ""} conectado${count > 1 ? "s" : ""}`
            : "No tienes productos";

    return (
        <div className="flex items-center gap-2 bg-[var(--h-card)] rounded-2xl px-4 py-2 border border-[var(--h-border)] shadow-sm self-start sm:self-auto">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
            <span className="text-sm font-bold text-[var(--h-text)]">{label}</span>
        </div>
    );
}
