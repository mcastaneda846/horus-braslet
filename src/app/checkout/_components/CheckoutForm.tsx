"use client";

import { useMemo, useState, useEffect } from "react";
import { COLOMBIA_DEPARTMENTS, COLOMBIA_CITIES_BY_DEPARTMENT } from "../_data/colombia";

export interface ShippingAddress {
    street: string;
    city: string;
    department: string;
    zip?: string;
}

interface CheckoutFormProps {
    productId: string;
    createOrder: (input: { productId: string; shippingAddress: ShippingAddress }) => Promise<{
        initPoint?: string;
        error?: string;
    }>;
}

export default function CheckoutForm({ productId, createOrder }: CheckoutFormProps) {
    const [form, setForm] = useState<ShippingAddress>({
        street: "",
        city: "",
        department: "",
        zip: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pedido, setPedido] = useState<{
        producto: string;
        colorNombre: string;
        colorHex: string;
        tieneImagenFrente?: boolean;
        tieneImagenReverso?: boolean;
    } | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("pedido");
        if (stored) {
            try {
                setPedido(JSON.parse(stored));
            } catch (err) {
                console.error("Error reading customization from sessionStorage:", err);
            }
        }
    }, []);

    const cityOptions = useMemo(() => {
        if (!form.department) return [];
        return COLOMBIA_CITIES_BY_DEPARTMENT[form.department] ?? [];
    }, [form.department]);

    const onChange = (field: keyof ShippingAddress, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const onDepartmentChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            department: value,
            city: prev.department === value ? prev.city : "",
        }));
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const result = await createOrder({
            productId,
            shippingAddress: {
                street: form.street.trim(),
                city: form.city.trim(),
                department: form.department.trim(),
                zip: form.zip?.trim() || undefined,
            },
        });

        if (result?.initPoint) {
            window.location.href = result.initPoint;
            return;
        }

        setError(result?.error ?? "No se pudo iniciar el pago.");
        setLoading(false);
    };

    return (
        <form onSubmit={onSubmit} className="bg-white border border-[#E4E2DC] rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-black text-[#1C1917]">Dirección de envío</h3>
            <p className="text-sm text-[#8D99AE] font-semibold mt-1 mb-5">
                Confirma la dirección para enviar tu dispositivo Horus.
            </p>

            {pedido && (
                <div className="mb-6 p-4 bg-[#F2F1EC]/60 border border-[#E4E2DC] rounded-2xl flex flex-col gap-2">
                    <p className="text-[10px] font-extrabold text-[#8D99AE] uppercase tracking-wider">
                        Personalización elegida
                    </p>
                    <div className="flex items-center justify-between text-sm text-[#1C1917]">
                        <span className="font-semibold">{pedido.producto}</span>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm"
                                style={{ backgroundColor: pedido.colorHex }}
                            />
                            <span className="text-xs text-[#8D99AE] font-bold">{pedido.colorNombre}</span>
                        </div>
                    </div>
                    {(pedido.tieneImagenFrente || pedido.tieneImagenReverso) && (
                        <p className="text-xs text-[#8D99AE] font-semibold flex items-center gap-1">
                            <span className="text-[#96C979]">✓</span> Con imagen de personalización cargada
                        </p>
                    )}
                </div>
            )}

            <div className="mt-6 grid gap-4">
                <label className="text-sm text-[#1C1917] font-semibold">
                    Dirección
                    <input
                        value={form.street}
                        onChange={(event) => onChange("street", event.target.value)}
                        required
                        className="mt-2 w-full rounded-xl border border-[#E4E2DC] bg-[#F2F1EC]/40 px-4 py-2.5 text-sm text-[#1C1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#FAB2D3]/40 focus:border-[#FAB2D3] transition-all duration-200"
                        placeholder="Calle 123 #45-67"
                    />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-[#1C1917] font-semibold">
                        Departamento
                        <input
                            list="department-list"
                            value={form.department}
                            onChange={(event) => onDepartmentChange(event.target.value)}
                            required
                            className="mt-2 w-full rounded-xl border border-[#E4E2DC] bg-[#F2F1EC]/40 px-4 py-2.5 text-sm text-[#1C1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#FAB2D3]/40 focus:border-[#FAB2D3] transition-all duration-200"
                            placeholder="Selecciona departamento"
                        />
                        <datalist id="department-list">
                            {COLOMBIA_DEPARTMENTS.map((department) => (
                                <option key={department} value={department} />
                            ))}
                        </datalist>
                    </label>
                    <label className="text-sm text-[#1C1917] font-semibold">
                        Ciudad
                        <input
                            list="city-list"
                            value={form.city}
                            onChange={(event) => onChange("city", event.target.value)}
                            required
                            className="mt-2 w-full rounded-xl border border-[#E4E2DC] bg-[#F2F1EC]/40 px-4 py-2.5 text-sm text-[#1C1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#FAB2D3]/40 focus:border-[#FAB2D3] transition-all duration-200"
                            placeholder={form.department ? "Selecciona ciudad" : "Selecciona departamento"}
                            disabled={!form.department}
                        />
                        <datalist id="city-list">
                            {cityOptions.map((city) => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                    </label>
                </div>
                <label className="text-sm text-[#1C1917] font-semibold">
                    Código postal (opcional)
                    <input
                        value={form.zip ?? ""}
                        onChange={(event) => onChange("zip", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#E4E2DC] bg-[#F2F1EC]/40 px-4 py-2.5 text-sm text-[#1C1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#FAB2D3]/40 focus:border-[#FAB2D3] transition-all duration-200"
                        placeholder="110111"
                    />
                </label>
            </div>

            {error && (
                <div className="mt-4 text-sm text-[#E62B34] bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-4 py-2.5 font-semibold">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-[#1C1917] text-white py-3.5 text-sm font-bold tracking-wide hover:bg-[#2D2A26] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
                {loading ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
            </button>
        </form>
    );
}
