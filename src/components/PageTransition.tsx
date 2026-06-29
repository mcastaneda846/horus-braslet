"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const el = ref.current;
        if (!el) return;

        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";

        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = "opacity 0.22s ease, transform 0.22s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";

                // Clear transform after animation completes to restore normal fixed positioning
                setTimeout(() => {
                    if (el) el.style.transform = "";
                }, 250);
            });
        });

        return () => cancelAnimationFrame(raf);
    }, [pathname]);

    return <div ref={ref}>{children}</div>;
}
