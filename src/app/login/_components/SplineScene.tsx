"use client";

import Spline from "@splinetool/react-spline";
import { useEffect, useRef } from "react";

const PANEL_BG = "#14151f";

export default function SplineScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (!containerRef.current) return;

            const targets = [
                ...Array.from(containerRef.current.querySelectorAll("a")),
                ...Array.from(document.querySelectorAll("a")),
            ];

            for (const el of targets) {
                const href = (el as HTMLAnchorElement).href ?? "";
                if (href.includes("spline") || href.includes("app.spline")) {
                    (el as HTMLElement).style.setProperty("display", "none", "important");
                }
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", height: "100%" }}
        >
            <Spline
                scene="https://prod.spline.design/UCZ948cVeHGCd0YL/scene.splinecode"
                style={{ width: "100%", height: "100%" }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "180px",
                    height: "48px",
                    background: `linear-gradient(to right, transparent 0%, ${PANEL_BG} 55%)`,
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "20px",
                    background: `linear-gradient(to top, ${PANEL_BG} 0%, transparent 100%)`,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
