"use client";

import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

interface StepTimerProps {
    duration: number; // en segundos
}

export const StepTimer: React.FC<StepTimerProps> = ({ duration }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Podríamos añadir un sonido aquí
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="mt-4 flex flex-col space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center text-white/80 font-bold">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-xl tabular-nums">
                        {minutes}:{seconds.toString().padStart(2, "0")}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={reset}
                        className="p-2 text-white/40 hover:text-white/60 transition-colors"
                        title="Reiniciar"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={toggle}
                        className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
                            isActive 
                            ? "bg-primary/20 text-primary hover:bg-primary/30" 
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                    >
                        {isActive ? (
                            <><Pause className="w-4 h-4 fill-current" /> <span>PAUSAR</span></>
                        ) : (
                            <><Play className="w-4 h-4 fill-current" /> <span>INICIAR</span></>
                        )}
                    </button>
                </div>
            </div>
            {timeLeft === 0 && (
                <p className="text-primary font-bold text-[10px] uppercase tracking-widest text-center animate-bounce">
                    ¡TIEMPO COMPLETADO!
                </p>
            )}
        </div>
    );
};
