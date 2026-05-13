import React from "react";
import { cn } from "@/src/shared/utils/cn";

export interface SeverityBadgeProps {
    severity: "critical" | "urgent" | "mild";
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
    const config = {
        critical: { 
            label: "CRÍTICO", 
            className: "bg-primary/10 text-primary border-primary/20" 
        },
        urgent: { 
            label: "URGENTE", 
            className: "bg-amber-500/10 text-amber-500 border-amber-500/20" 
        },
        mild: { 
            label: "ESTABLE", 
            className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
        },
    };

    const { label, className } = config[severity];

    return (
        <span className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold border tracking-[0.2em] transition-all", 
            className
        )}>
            {label}
        </span>
    );
};
