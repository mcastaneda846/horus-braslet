"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  TrendingUp,
  Brain
} from "lucide-react";
import { IndexedDBProtocolRepository }   from "@/src/infrastructure/repositories/indexeddb-protocol.repository";
import { syncProtocolsUseCase }           from "@/src/application/first-aid/sync-protocols.use-case";
import { searchProtocolsUseCase, getProtocolsByCategoryUseCase }         from "@/src/application/first-aid/search-protocols.use-case";
import type { SearchResult }              from "@/src/shared/types/first-aid.types";
import { SeverityBadge }                  from "@/src/presentation/components/shared/SeverityBadge";
import { cn }                             from "@/src/shared/utils/cn";
import Link                               from "next/link";

const repository = new IndexedDBProtocolRepository();

export default function Dashboard() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSyncing, setIsSyncing] = useState(true);

    useEffect(() => {
        const init = async () => {
            await syncProtocolsUseCase(repository);
            setIsSyncing(false);
        };
        init();
    }, []);

    useEffect(() => {
        const performSearch = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            // Detectar si es una búsqueda por categoría
            if (query.startsWith("category:")) {
                const category = query.replace("category:", "");
                const protocols = await getProtocolsByCategoryUseCase(repository, category);
                setResults(protocols.map((p) => ({ protocol: p, score: 1 })));
            } else {
                const data = await searchProtocolsUseCase(repository, query);
                setResults(data);
            }
        };
        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (isSyncing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <HeartPulse className="w-12 h-12 text-primary relative z-10" />
                </div>
                <p className="mt-6 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Cargando Sistema...</p>
                <div className="mt-4 w-32 h-1 bg-accent rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ x: [-150, 150] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-full bg-primary"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto py-12 px-4">
            <div className="flex flex-col items-center mb-12">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6"
                >
                    <HeartPulse className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight text-white">HORUS <span className="text-primary">AID</span></h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-2">SISTEMA DE RESPUESTA MÉDICA</p>
            </div>
            
            <div className="max-w-4xl mx-auto w-full space-y-12">
                {/* Search Hero */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-card border border-border/50 p-2 rounded-2xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-6 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                className="w-full pl-16 pr-6 py-6 bg-transparent rounded-xl focus:outline-none transition-all text-lg text-white placeholder:text-muted-foreground/50"
                                placeholder="¿Cuál es la emergencia? Busque un protocolo..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard icon={<Zap />} label="Respuesta" value="Inmediata" color="text-amber-500" />
                    <StatCard icon={<Clock />} label="Uptime" value="100% Offline" color="text-emerald-500" />
                    <StatCard icon={<Brain />} label="IA Local" value="Activa" color="text-blue-500" />
                </div>

                {/* System Status - More subtle */}
                <div className="bg-card/30 border border-border/40 p-6 rounded-2xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Estado del Sistema</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                <SystemStatusItem label="Base de Datos" status="Sincronizado" />
                                <SystemStatusItem label="Service Worker" status="Activo" />
                                <SystemStatusItem label="Cache Médica" status="98.2 MB" />
                                <SystemStatusItem label="Geolocalización" status="En línea" />
                            </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 border-dashed">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-4 h-4 text-primary" />
                                <span className="font-bold text-[10px] text-primary uppercase tracking-widest">Aviso Crítico</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                En caso de riesgo vital, contacte con los servicios de emergencia (911) inmediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocols Section */}
            <section className="pt-4">
                <AnimatePresence mode="wait">
                    {query.length > 0 ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Resultados para: <span className="text-foreground">{query}</span>
                                </h2>
                                <span className="text-[10px] text-muted-foreground">{results.length} encontrados</span>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.map(({ protocol }, index) => (
                                    <Link key={protocol.id} href={`/protocol/${protocol.id}`}>
                                        <div className="bg-card border border-border/50 p-5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-all group cursor-pointer relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="p-2 rounded-lg bg-accent/50 text-muted-foreground group-hover:text-primary transition-colors">
                                                    <HeartPulse className="w-5 h-5" />
                                                </div>
                                                <SeverityBadge severity={protocol.severity} />
                                            </div>
                                            <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors relative z-10 text-white">{protocol.title}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 relative z-10">{protocol.symptoms.join(", ")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="categories"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Categorías de Emergencia</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <CategoryCard icon={<HeartPulse />} title="Cardíaco" count="12" categoryId="cardiac" onCategoryClick={(category) => setQuery(`category:${category}`)} />
                                <CategoryCard icon={<Activity />} title="Respiratorio" count="8" categoryId="respiratory" onCategoryClick={(category) => setQuery(`category:${category}`)} />
                                <CategoryCard icon={<AlertTriangle />} title="Trauma" count="15" categoryId="trauma" onCategoryClick={(category) => setQuery(`category:${category}`)} />
                                <CategoryCard icon={<TrendingUp />} title="Signos Vitales" count="5" categoryId="vital-signs" onCategoryClick={(category) => setQuery(`category:${category}`)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
            <div className={cn("p-2 rounded-lg bg-accent/50", color)}>
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
            </div>
            <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold">{value}</p>
            </div>
        </div>
    );
}

function SystemStatusItem({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-foreground/80">{status}</span>
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
        </div>
    );
}

function CategoryCard({ icon, title, count, categoryId, onCategoryClick }: { icon: React.ReactNode, title: string, count: string, categoryId: string, onCategoryClick: (category: string) => void }) {
    return (
        <button onClick={() => onCategoryClick(categoryId)} className="w-full text-left bg-card/50 border border-border/50 p-6 rounded-xl hover:border-primary/30 hover:bg-white/[0.02] transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
            <div className="p-2.5 w-fit rounded-lg bg-accent/50 text-muted-foreground group-hover:text-primary transition-colors mb-4 relative z-10">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
            </div>
            <div className="relative z-10">
                <p className="font-bold text-sm mb-1 text-white">{title}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{count} Protocolos</p>
            </div>
        </button>
    );
}
