"use client";

import React, { useState } from "react";
import type { DecisionNode, ProtocolStep } from "@/src/domain/first-aid/protocol.entity";
import { ChevronRight, ArrowLeft, CheckCircle2, ShieldAlert, Clock, Play } from "lucide-react";
import { cn } from "@/src/shared/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { StepTimer } from "@/src/presentation/components/protocol/StepTimer";

interface DecisionTreeProps {
    nodes: DecisionNode[];
    initialSteps: ProtocolStep[];
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ nodes, initialSteps }) => {
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(nodes[0]?.id || null);
    const [history, setHistory] = useState<string[]>([]);
    const [finalSteps, setFinalSteps] = useState<ProtocolStep[] | null>(null);

    const currentNode = nodes.find(n => n.id === currentNodeId);

    const handleChoice = (choice: "yes" | "no") => {
        if (!currentNode) return;

        const next = currentNode[choice];

        if (Array.isArray(next)) {
            setFinalSteps(next);
            setCurrentNodeId(null);
        } else {
            setHistory([...history, currentNode.id]);
            setCurrentNodeId(next);
        }
    };

    const handleBack = () => {
        if (finalSteps) {
            setFinalSteps(null);
            setCurrentNodeId(history[history.length - 1]);
            setHistory(history.slice(0, -1));
        } else if (history.length > 0) {
            const prevId = history[history.length - 1];
            setCurrentNodeId(prevId);
            setHistory(history.slice(0, -1));
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {finalSteps ? (
                    <motion.div 
                        key="results"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <button 
                            onClick={handleBack}
                            className="flex items-center text-primary text-xs font-bold hover:opacity-80 transition-all uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER A LA EVALUACIÓN
                        </button>
                        
                        <div className="glass-panel border-green-500/20 p-6 rounded-3xl flex items-start space-x-4 bg-green-500/5">
                            <div className="p-2 bg-green-500/20 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Evaluación Finalizada</h4>
                                <p className="text-white/60 text-sm">Sigue estas instrucciones críticas de inmediato:</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {finalSteps.map((step, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-6 rounded-3xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                    <div className="flex items-start space-x-5">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 border border-white/5">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white leading-relaxed font-medium">{step.instruction}</p>
                                            {step.duration && (
                                                <div className="mt-4">
                                                    <StepTimer duration={step.duration} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : currentNode ? (
                    <motion.div 
                        key="question"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                        
                        <div className="relative z-10">
                            {history.length > 0 && (
                                <button 
                                    onClick={handleBack}
                                    className="mb-6 flex items-center text-white/40 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-[0.2em]"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-2" /> REVERTIR PASO
                                </button>
                            )}
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-primary/20">
                                    <ShieldAlert className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Protocolo Adaptativo</span>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-10 leading-tight">
                                {currentNode.question}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleChoice("yes")}
                                    className="bg-primary text-white py-5 rounded-2xl font-bold text-lg neo-glow-red flex items-center justify-center gap-2 group"
                                >
                                    AFIRMATIVO <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleChoice("no")}
                                    className="bg-white/5 text-white/60 hover:text-white hover:bg-white/10 py-5 rounded-2xl font-bold text-lg transition-all border border-white/5"
                                >
                                    NEGATIVO
                                </motion.button>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-12 flex items-center justify-between">
                                <div className="flex space-x-1.5">
                                    {nodes.map((n, i) => (
                                        <div 
                                            key={n.id} 
                                            className={cn(
                                                "w-8 h-1 rounded-full transition-all duration-500",
                                                i < history.length ? "bg-primary shadow-[0_0_8px_#FF2345]" : 
                                                i === history.length ? "bg-white/20 animate-pulse" : "bg-white/5"
                                            )} 
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Paso {history.length + 1} de {nodes.length}</span>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};
