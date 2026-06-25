import Link from "next/link";
import { redirect } from "next/navigation";
import EyeOfHorusIcon from "@/src/components/EyeOfHorusIcon";
import LogoutButton from "@/src/app/dashboard/_components/LogoutButton";
import { authGuard } from "@/src/shared/lib/auth.guard";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { ProductCard } from "@/src/components/tienda/ProductCard";

export const metadata = {
    title: "Tienda · Horus Braslet",
    description: "Elige tu producto Horus y completa tu suscripción.",
};

const COLORES_MANILLA = [
    { hex: '#a5ccf4' },
    { hex: '#fad957' },
    { hex: '#2D2520' },
    { hex: '#fab2d3' },
    { hex: '#6cc581' },
];

const COLORES_TARJETA = [
    { hex: '#391628' },
    { hex: '#a5ccf4' },
    { hex: '#f6c835' },
    { hex: '#fab2d3' },
    { hex: '#6cc581' },
];

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-[#EF233C] text-white" : "text-[#8D99AE] hover:text-white hover:bg-white/5"
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}

export default async function StorePage() {
    try {
        await authGuard();
    } catch {
        redirect("/login");
    }

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            productType: { in: ["BRACELET", "CARD"] },
        },
        orderBy: { price: "asc" },
    });

    const mappedProducts = products.map((product) => {
        const isBracelet = product.productType === "BRACELET";
        return {
            id: product.id,
            nombre: product.name,
            descripcion: product.description ?? (isBracelet 
                ? "Correa en cuero genuino · Placa acero inoxidable" 
                : "Ambos lados · Tu imagen en alta resolución"
            ),
            precio: Number(product.price).toLocaleString("es-CO"),
            href: isBracelet 
                ? `/personalizar/manilla?productId=${product.id}` 
                : `/personalizar/tarjeta?productId=${product.id}`,
            modelType: isBracelet ? ("manilla" as const) : ("tarjeta" as const),
            defaultColor: isBracelet ? "#a5ccf4" : "#391628",
            caracteristicas: isBracelet ? [
                'Cuero genuino premium',
                'Placa acero inoxidable 316L',
                'Grabado láser de datos médicos',
                'Resistente al agua IP67',
            ] : [
                'Ambos lados personalizados',
                'Tu imagen en alta resolución',
                'Material PVC premium',
                '5 colores de fondo disponibles',
            ],
            colores: isBracelet ? COLORES_MANILLA : COLORES_TARJETA,
        };
    });

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ── Barra superior móvil (visible solo en pantallas pequeñas) ── */}
            <header className="lg:hidden flex items-center justify-between bg-[#1a1c2a] px-4 py-3 shrink-0">
                <div className="flex items-center gap-2.5">
                    <EyeOfHorusIcon className="w-7 h-7" />
                    <span className="text-white font-bold tracking-widest text-xs uppercase">Horus Braslet</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                        <span className="text-xs text-[#8D99AE]">Conectada</span>
                    </div>
                    <LogoutButton compact />
                </div>
            </header>

            {/* ── Sidebar (visible solo en pantallas grandes) ───────────────── */}
            <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#1a1c2a] px-4 py-6">
                <div className="flex items-center gap-2.5 px-2 mb-10">
                    <EyeOfHorusIcon className="w-9 h-7" />
                    <span className="text-white font-bold tracking-widest text-sm uppercase">Horus Braslet</span>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    <NavLink href="/dashboard" label="Dashboard"
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>}
                    />
                    <NavLink href="/profile" label="Perfil"
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>}
                    />
                    <NavLink href="/medical" label="Perfil Médico"
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/></svg>}
                    />
                    <NavLink active href="/tienda" label="Tienda"
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/></svg>}
                    />
                </nav>

                <div className="border-t border-white/10 pt-4">
                    <LogoutButton />
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="flex-1 bg-[#EDF2F4] p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto mt-2">
                    <div className="mb-8">
                        <p className="text-xs font-semibold tracking-widest text-[#8D99AE] uppercase mb-2">
                            Catálogo
                        </p>
                        <h2 className="text-3xl font-bold text-[#2B2D42] tracking-tight">
                            Elige tu producto
                        </h2>
                        <p className="text-[#8D99AE] mt-1.5 text-sm">
                            Personaliza en segundos y recibe en casa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {mappedProducts.map((p) => (
                            <ProductCard key={p.id} {...p} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="bg-white border border-[#EDF2F4] rounded-2xl p-8 text-center text-sm text-[#8D99AE] shadow-sm">
                            No hay productos disponibles en este momento.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
