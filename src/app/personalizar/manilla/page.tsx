'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCanvas } from '@/src/components/3d/ProductCanvas'
import { ManillaModel } from '@/src/components/3d/ManillaModel'
import { ColorPicker } from '@/src/components/personalizar/ColorPicker'

const COLORES = [
  { nombre: 'Azul',     hex: '#a5ccf4' },
  { nombre: 'Amarrillo',    hex: '#fad957' },
  { nombre: 'Negro',    hex: '#2D2520' },
  { nombre: 'Burdeos',  hex: '#fab2d3' },
  { nombre: 'Verde',    hex: '#6cc581' },
]

const SPECS = [
  { label: 'Material',    valor: 'Cuero genuino' },
  { label: 'Placa',       valor: 'Acero 316L' },
  { label: 'Resistencia', valor: 'IP67' },
  { label: 'Talla',       valor: 'Ajustable' },
]

const FEATURES = [
  'Grabado láser de información médica',
  'Material hipoalergénico certificado',
  'Resistente al agua y al sudor IP67',
  'Talla universal ajustable',
  'Placa acero inoxidable 316L',
  'Cuero genuino premium cosido',
]

/**
 * ManillaConfigurator: Configurator page component allowing users to customize
 * the base color of their 3D medical bracelet, preview changes in real-time,
 * and proceed to checkout by saving customizations in sessionStorage.
 */
function ManillaConfigurator() {
  const [color, setColor] = useState(COLORES[0].hex) // Color state hook, default to the first color (Azul)
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId') // Extract productId from the URL search parameters

  const colorActual = COLORES.find(c => c.hex === color) ?? COLORES[0]

  /**
   * Saves customization details in client sessionStorage and redirects the user to checkout.
   */
  const handleComprar = () => {
    if (!productId) {
      router.push('/tienda')
      return
    }
    // Save choices to sessionStorage so the checkout form can render customized details
    sessionStorage.setItem('pedido', JSON.stringify({
      producto: 'Manilla Médica',
      colorNombre: colorActual.nombre,
      colorHex: color,
      precio: 29900,
    }))
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ── HEADER ── */}
      <header className="flex items-center px-6 h-12 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5"
        >
          ← Volver
        </button>
        <span className="mx-auto text-xs tracking-widest text-gray-300 uppercase">
          Horus Guard · Configurador
        </span>
        <div className="w-14" />
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* ── LEFT COLUMN: 3D Canvas Preview ── */}
        <div className="flex-1 flex flex-col bg-gray-50 min-h-[320px] lg:min-h-0">
          {/* WebGL Canvas occupying all available space */}
          <div className="flex-1">
            <ProductCanvas enableOrbit={true} cameraPosition={[0, 1.2, 5]}>
              <ManillaModel color={color} autoRotate={true} />
            </ProductCanvas>
          </div>

          {/* Technical specifications panel footer (desktop only) */}
          <div className="hidden lg:grid grid-cols-4 border-t border-gray-200 bg-white shrink-0">
            {SPECS.map((s) => (
              <div key={s.label} className="py-3.5 px-5 border-r border-gray-100 last:border-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">{s.label}</p>
                <p className="text-sm font-medium text-gray-800">{s.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Configuration Sidebar ── */}
        <div className="
          w-full lg:w-[400px] xl:w-[440px]
          lg:h-full overflow-y-auto
          border-t lg:border-t-0 lg:border-l border-gray-100
          flex flex-col
        ">
          <div className="flex flex-col gap-7 p-7 flex-1">
            {/* Product description header */}
            <div>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">
                Horus Guard
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Manilla Médica
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Cuero genuino · Placa acero inoxidable
              </p>
            </div>

            {/* Band color swatches selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">Color</p>
                <p className="text-sm text-gray-500 font-medium">{colorActual.nombre}</p>
              </div>
              <ColorPicker
                colores={COLORES}
                colorSeleccionado={color}
                onChange={setColor}
                size="lg"
              />
            </div>

            {/* Checklist of features */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Incluye</p>
              <div className="grid grid-cols-2 gap-2">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                    <span className="text-green-500 text-xs mt-0.5 shrink-0">✓</span>
                    <span className="text-xs text-gray-600 leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing details and checkout CTA button */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-sm text-[#8D99AE]">Precio total</p>
                <p className="text-3xl font-bold text-gray-900">
                  $29.900
                  <span className="text-sm font-normal text-gray-400 ml-1">COP</span>
                </p>
              </div>
              <button
                onClick={handleComprar}
                className="
                  w-full bg-gray-900 text-white py-3.5 rounded-2xl
                  font-medium text-sm tracking-wide
                  hover:bg-gray-700 active:scale-95
                  transition-all duration-200
                "
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PersonalizarManillaPage() {
  return (
    // Wrap configurator with Suspense to handle useSearchParams CSR hydration
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm text-gray-500">Cargando configurador...</div>}>
      <ManillaConfigurator />
    </Suspense>
  )
}
