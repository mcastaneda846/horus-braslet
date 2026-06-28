import Link from "next/link";
import { redirect } from "next/navigation";
import EyeOfHorusIcon from "@/src/components/EyeOfHorusIcon";
import { authGuard } from "@/src/shared/lib/auth.guard";

interface PaymentStatusPageProps {
    searchParams: Promise<{ orderId?: string }>;
}

interface OrderStatusData {
    id: string;
    reference: string;
    status: string;
    totalAmount: number | string;
    currency: string;
    createdAt: string;
    product: { name: string; productType: string } | null;
    payment: { status: string; paidAt: string | null } | null;
}

async function getOrderStatus(orderId: string): Promise<OrderStatusData | null> {
    const session = await authGuard();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        return null;
    }

    const response = await fetch(`${baseUrl}/api/payments/status/${orderId}`, {
        headers: {
            "x-user-id": session.sub,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
}

export default async function PaymentErrorPage({ searchParams }: PaymentStatusPageProps) {
    const { orderId } = await searchParams;

    if (!orderId) {
        redirect("/tienda");
    }

    let order: OrderStatusData | null = null;
    try {
        order = await getOrderStatus(orderId);
    } catch {
        order = null;
    }

    return (
        <div className="min-h-screen bg-[var(--h-bg)] flex flex-col">
            <header className="flex items-center justify-between px-6 md:px-10 py-6 bg-[var(--h-card)] border-b border-[var(--h-border)]">
                <div className="flex items-center gap-3">
                    <EyeOfHorusIcon className="w-7 h-7" />
                    <div>
                        <p className="text-xs text-[#8D99AE] uppercase tracking-[0.2em]">Pago rechazado</p>
                        <h1 className="text-lg font-bold text-[var(--h-text)]">Horus Braslet</h1>
                    </div>
                </div>
                <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-[#EF233C] hover:text-[#D90429] transition-colors"
                >
                    Ir al dashboard
                </Link>
            </header>

            <main className="flex-1 px-6 md:px-10 py-10">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[var(--h-card)] border border-[var(--h-border)] rounded-2xl p-8 shadow-sm text-center">
                        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] text-[#EF233C] flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--h-text)] mt-4">Pago rechazado</h2>
                        <p className="text-sm text-[#8D99AE] mt-2">
                            No pudimos procesar tu pago. Puedes intentarlo de nuevo o usar otro metodo.
                        </p>

                        <div className="mt-6 text-left border-t border-[var(--h-border)] pt-6 space-y-2 text-sm text-[var(--h-muted)]">
                            <div className="flex items-center justify-between">
                                <span>Orden</span>
                                <span className="text-[var(--h-text)] font-semibold">{order?.reference ?? orderId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Producto</span>
                                <span className="text-[var(--h-text)] font-semibold">{order?.product?.name ?? "Horus"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Estado</span>
                                <span className="text-[#EF233C] font-semibold">{order?.status ?? "CANCELLED"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Total</span>
                                <span className="text-[var(--h-text)] font-semibold">
                                    ${Number(order?.totalAmount ?? 0).toLocaleString("es-CO")}
                                    <span className="text-xs text-[#8D99AE]"> {order?.currency ?? "COP"}</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/tienda"
                                className="px-5 py-2.5 rounded-xl border border-[var(--h-border)] text-[var(--h-text)] text-sm font-semibold hover:bg-[var(--h-card2)] transition-colors"
                            >
                                Volver a la tienda
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-xl bg-[#EF233C] text-white text-sm font-semibold hover:bg-[#D90429] transition-colors"
                            >
                                Ir al dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

