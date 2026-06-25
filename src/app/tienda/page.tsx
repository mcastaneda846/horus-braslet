import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/src/app/dashboard/_components/LogoutButton";
import { authGuard } from "@/src/shared/lib/auth.guard";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { ProductCard } from "@/src/components/tienda/ProductCard";
import FloatingSidebar from "@/src/components/FloatingSidebar";

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

// NavLink removed to use FloatingSidebar

/**
 * StorePage: Server Component rendering the storefront product catalog.
 * Authenticates the user session, queries active products from PostgreSQL,
 * and formats the product features and configurations for 3D preview cards.
 */
export default async function StorePage() {
    // 1. Authenticate user session using JWT cookie guard
    try {
        await authGuard();
    } catch {
        redirect("/login");
    }

    // 2. Fetch active products (Bracelet or Card type) from the database
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            productType: { in: ["BRACELET", "CARD"] },
        },
        orderBy: { price: "asc" },
    });

    // 3. Map database products into structured data for UI rendering
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
            // Redirects to customization pages passing the product ID
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
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F2F1EC] text-[#1C1917]">
            {/* ── Barra superior móvil (limpia e integrada) ── */}
            <header className="lg:hidden flex items-center justify-between bg-white border-b border-[#E4E2DC] px-6 py-4 shrink-0">
                <div className="flex items-center gap-2.5 ml-14">
                    <img src="/gato.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-[#1C1917] font-black tracking-widest text-sm uppercase">Horus</span>
                </div>
                <LogoutButton compact />
            </header>

            {/* ── Sidebar Flotante Izquierdo ── */}
            <FloatingSidebar />

            {/* ── Main Content Area ── */}
            <main className="flex-1 lg:pl-80 p-6 md:p-10 overflow-y-auto w-full max-w-[1400px] mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <p className="text-xs font-extrabold tracking-widest text-[#8D99AE] uppercase mb-2">
                            Catálogo
                        </p>
                        <h2 className="text-3xl font-black text-[#1C1917] tracking-tight">
                            Elige tu producto
                        </h2>
                        <p className="text-[#8D99AE] mt-1.5 text-sm font-semibold">
                            Personaliza en segundos y recibe en casa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {mappedProducts.map((p) => (
                            <ProductCard key={p.id} {...p} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="bg-white border border-[#E4E2DC] rounded-3xl p-8 text-center text-sm text-[#8D99AE] shadow-sm font-semibold">
                            No hay productos disponibles en este momento.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
