"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Info, AlertCircle, Play, Shield, Phone, Clock } from "lucide-react";
import { IndexedDBProtocolRepository } from "@/src/infrastructure/repositories/indexeddb-protocol.repository";
import type { Protocol, ProtocolStep } from "@/src/domain/first-aid/protocol.entity";
import { SeverityBadge } from "@/src/presentation/components/shared/SeverityBadge";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DecisionTree } from "@/src/presentation/components/protocol/DecisionTree";
import { StepTimer } from "@/src/presentation/components/protocol/StepTimer";
import { motion } from "framer-motion";

const repository = new IndexedDBProtocolRepository();

export default function ProtocolDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [protocol, setProtocol] = useState<Protocol | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (id) {
                const data = await repository.getById(id);
                setProtocol(data);
            }
            setIsLoading(false);
        };
        load();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Cifrando Protocolo...</p>
            </div>
        );
    }

    if (!protocol) {
        return (
            <div className="text-center py-20 glass-panel rounded-3xl">
                <AlertCircle className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
                <h2 className="text-2xl font-bold mb-4">Protocolo No Encontrado</h2>
                <Link 
                    href="/"
                    className="text-primary font-bold hover:underline"
                >
                    Volver al Dashboard Central
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Header / Meta */}
            <header className="space-y-6">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 rounded-xl glass-card hover:bg-white/10 transition-all text-white/60 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Shield className="w-40 h-40" />
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <SeverityBadge severity={protocol.severity} />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">ID: {protocol.id.toUpperCase()}</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{protocol.title}</h1>
                        <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                            Este protocolo define los pasos críticos para actuar ante {protocol.title.toLowerCase()}. 
                            Siga las instrucciones con precisión.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Warnings Section */}
                    {protocol.warnings.length > 0 && (
                        <section className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-primary uppercase tracking-widest text-sm">Advertencias Críticas</h3>
                            </div>
                            <ul className="space-y-3">
                                {protocol.warnings.map((warning, i) => (
                                    <li key={i} className="text-sm text-white/80 flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Decision Tree / Steps */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-xs uppercase tracking-[0.3em] text-white/40">Flujo de Acción</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-green-400">
                                <Play className="w-3 h-3" /> SISTEMA ACTIVO
                            </div>
                        </div>
                        {protocol.decisionTree && protocol.decisionTree.length > 0 ? (
                            <DecisionTree nodes={protocol.decisionTree} initialSteps={protocol.steps} />
                        ) : (
                            <div className="space-y-4">
                                {protocol.steps.map((step, index) => (
                                    <div key={step.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        <div className="flex items-start space-x-5">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 border border-white/5">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white leading-relaxed font-medium">{step.instruction}</p>
                                                {step.duration && <div className="mt-4"><StepTimer duration={step.duration} /></div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Info */}
                <aside className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl space-y-6">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-white/40">Resumen Médico</h4>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Síntomas Clave</p>
                                <div className="flex flex-wrap gap-2">
                                    {protocol.symptoms.map((s, i) => (
                                        <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-white/70">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Categoría</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#FF2345]" />
                                    <span className="text-sm font-bold">{protocol.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-white/40">
                                <Info className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Nota Legal</span>
                            </div>
                            <p className="text-[10px] text-white/30 leading-relaxed italic">
                                La información proporcionada es solo para fines educativos. 
                                En caso de duda, priorice la comunicación con servicios de emergencia profesionales.
                            </p>
                        </div>
                    </div>

                    {protocol.callEmergency && (
                        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 neo-glow-red hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Phone className="w-5 h-5" />
                            <span>EMERGENCIA 123</span>
                        </button>
                    )}
                </aside>
            </div>
        </motion.div>
    );
}
