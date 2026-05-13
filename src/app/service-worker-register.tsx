"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("✅ Service Worker registrado:", registration);

          // Forzar que "claim" las páginas actuales
          if (registration.active) {
            registration.active.postMessage({ type: "SKIP_WAITING" });
          }

          // Controlar updates
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("✅ Service Worker actualizado y controlando páginas");
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn("⚠️ Error registrando Service Worker:", error);
        });
    }
  }, []);

  return null;
}

