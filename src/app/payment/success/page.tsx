import Link from "next/link";
import { redirect } from "next/navigation";
import { authGuard } from "@/src/shared/lib/auth.guard";

interface PaymentSuccessSearchParams {
    orderId?: string;
    collection_id?: string;      // MP payment ID — enviado por MP en el redirect
    collection_status?: string;
    external_reference?: string;
}

interface PaymentStatusPageProps {
    searchParams: Promise<PaymentSuccessSearchParams>;
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
    subscription?: { status: string; startDate: string | null; endDate: string | null } | null;
}

async function syncAndGetOrder(
    orderId: string,
    mpPaymentId: string | undefined,
    userId: string,
    userEmail: string
): Promise<OrderStatusData | null> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) return null;

    // Sincronizar con MP (captura sandbox + webhook tardío)
    if (mpPaymentId) {
        try {
            await fetch(`${baseUrl}/api/payments/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id":    userId,
                    "x-user-email": userEmail,
                },
                body: JSON.stringify({ orderId, mpPaymentId }),
                cache: "no-store",
            });
        } catch {
            // no bloquear si sync falla
        }
    }

    // Obtener estado actualizado
    const res = await fetch(`${baseUrl}/api/payments/status/${orderId}`, {
        headers: { "x-user-id": userId },
        cache:   "no-store",
    });

    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data ?? null;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentStatusPageProps) {
    const params = await searchParams;
    const { orderId, collection_id, collection_status } = params;

    if (!orderId) redirect("/tienda");

    let session;
    try {
        session = await authGuard();
    } catch {
        redirect("/login");
    }

    let order: OrderStatusData | null = null;
    try {
        order = await syncAndGetOrder(orderId, collection_id, session.sub, session.email);
    } catch {
        order = null;
    }

    const isPaid   = order?.status === "PAID"   || collection_status === "approved";
    const isFailed = collection_status === "rejected" || collection_status === "null";

    return (
        <div className="min-h-screen bg-[var(--h-bg)] flex flex-col">

            {/* Floating navbar */}
            <div style={{
                position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
                zIndex: 50, width: "calc(100% - 48px)", maxWidth: "760px",
                background: "#1A1512", borderRadius: "100px",
                padding: "8px 8px 8px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos-horus-1.svg" alt="Horus" style={{ height: "28px", width: "auto" }} />
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em" }}>Horus Health</span>
                </Link>
                <Link href="/dashboard" style={{
                    background: "#FAD957", color: "#1A1512", borderRadius: "100px",
                    padding: "8px 20px", fontSize: "13px", fontWeight: 700,
                    textDecoration: "none", whiteSpace: "nowrap",
                }}>
                    Ir al dashboard
                </Link>
            </div>

            <main className="flex-1 px-6 md:px-10 py-10" style={{ paddingTop: "96px" }}>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[var(--h-card)] border border-[var(--h-border)] rounded-2xl p-8 shadow-sm text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                            isPaid && !isFailed
                                ? "bg-[#DCFCE7] text-[#22C55E]"
                                : "bg-[#FEE2E2] text-[#EF233C]"
                        }`}>
                            {isPaid && !isFailed ? (
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-[var(--h-text)] mt-4">
                            {isPaid && !isFailed ? "Pago aprobado" : "Pago no completado"}
                        </h2>
                        <p className="text-sm text-[#8D99AE] mt-2">
                            {isPaid && !isFailed
                                ? "Tu pago fue confirmado. Hemos activado tu suscripción y enviado el comprobante a tu correo."
                                : "El pago no pudo procesarse. Intenta de nuevo o usa otro método de pago."}
                        </p>

                        <div className="mt-6 text-left border-t border-[var(--h-border)] pt-6 space-y-2 text-sm text-[var(--h-muted)]">
                            <div className="flex items-center justify-between">
                                <span>Referencia</span>
                                <span className="text-[var(--h-text)] font-semibold">{order?.reference ?? orderId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Producto</span>
                                <span className="text-[var(--h-text)] font-semibold">{order?.product?.name ?? "Horus"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Estado</span>
                                <span className={`font-semibold ${
                                    order?.status === "PAID" ? "text-[#22C55E]" :
                                    order?.status === "CANCELLED" ? "text-[#EF233C]" : "text-[#F59E0B]"
                                }`}>
                                    {order?.status ?? (isPaid ? "PAID" : "PENDING")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Total</span>
                                <span className="text-[var(--h-text)] font-semibold">
                                    ${Number(order?.totalAmount ?? 0).toLocaleString("es-CO")}
                                    <span className="text-xs text-[#8D99AE]"> {order?.currency ?? "COP"}</span>
                                </span>
                            </div>
                            {order?.subscription?.endDate && (
                                <div className="flex items-center justify-between">
                                    <span>Suscripción hasta</span>
                                    <span className="text-[var(--h-text)] font-semibold">
                                        {new Date(order.subscription.endDate).toLocaleDateString("es-CO")}
                                    </span>
                                </div>
                            )}
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
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                style={{ background: "#1A1512", color: "#FAD957" }}
                            >
                                Ver dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
