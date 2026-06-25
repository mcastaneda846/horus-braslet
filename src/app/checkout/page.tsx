import Link from "next/link";
import { redirect } from "next/navigation";
import { authGuard } from "@/src/shared/lib/auth.guard";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import CheckoutForm, { ShippingAddress } from "./_components/CheckoutForm";
import { headers } from "next/headers";

export const metadata = {
    title: "Checkout · Horus Braslet",
    description: "Completa tu pago con Mercado Pago.",
};

interface CheckoutPageProps {
    searchParams: Promise<{ productId?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const { productId } = await searchParams;

    if (!productId) {
        redirect("/tienda");
    }

    try {
        await authGuard();
    } catch {
        redirect("/login");
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product || !product.isActive) {
        redirect("/tienda");
    }

    const createOrder = async (input: { productId: string; shippingAddress: ShippingAddress }) => {
        "use server";

        const session = await authGuard();
        const headersList = await headers();
        const host = headersList.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        const response = await fetch(`${baseUrl}/api/payments/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.sub,
                "x-user-email": session.email,
            },
            body: JSON.stringify(input),
            cache: "no-store",
        });

        const payload = await response.json();
        if (!response.ok) {
            return { error: payload?.message ?? "No se pudo crear la orden." };
        }

        const isTestToken = (process.env.MP_ACCESS_TOKEN ?? "").startsWith("TEST-");
        const initPoint = isTestToken
            ? payload?.data?.sandboxUrl ?? payload?.data?.initPoint
            : payload?.data?.initPoint ?? payload?.data?.sandboxUrl;
        if (!initPoint) {
            return { error: "No se recibio la URL de pago." };
        }

        return { initPoint };
    };

    return (
        <div className="min-h-screen bg-[#F2F1EC] text-[#1C1917]">
            <header className="flex items-center justify-between px-6 md:px-10 py-6 bg-white border-b border-[#E4E2DC]">
                <div className="flex items-center gap-3">
                    <img src="/gato.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <div>
                        <p className="text-xs text-[#8D99AE] uppercase tracking-[0.2em] font-extrabold">Checkout</p>
                        <h1 className="text-lg font-black text-[#1C1917] uppercase">Horus</h1>
                    </div>
                </div>
                <Link
                    href="/tienda"
                    className="text-sm font-bold text-[#1C1917] hover:text-[#8D99AE] transition-colors underline underline-offset-4"
                >
                    Volver a la tienda
                </Link>
            </header>

            <main className="px-6 md:px-10 py-10">
                <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="bg-white border border-[#E4E2DC] rounded-[32px] p-8 shadow-sm h-fit">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#8D99AE] font-extrabold">Resumen</p>
                        <h2 className="text-2xl font-black text-[#1C1917] mt-2">{product.name}</h2>
                        <p className="text-sm text-[#8D99AE] font-semibold mt-2">
                            {product.description ?? "Dispositivo Horus con tecnología NFC y suscripción anual."}
                        </p>
                        <div className="mt-6 border-t border-[#E4E2DC] pt-6 space-y-3">
                            <div className="flex items-center justify-between text-sm text-[#8D99AE] font-semibold">
                                <span>Producto</span>
                                <span className="text-[#1C1917] font-bold">{product.productType === "BRACELET" ? "Manilla" : "Tarjeta"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-[#8D99AE] font-semibold">
                                <span>Suscripción</span>
                                <span className="text-[#1C1917] font-bold">Anual</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-black text-[#1C1917] pt-3 border-t border-[#E4E2DC]/60">
                                <span>Total</span>
                                <span>
                                    ${Number(product.price).toLocaleString("es-CO")}
                                    <span className="text-sm font-bold text-[#8D99AE]"> COP</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <CheckoutForm productId={product.id} createOrder={createOrder} />
                </div>
            </main>
        </div>
    );
}
