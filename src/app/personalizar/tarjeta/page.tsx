'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCanvas } from '@/src/components/3d/ProductCanvas'
import { TarjetaModel } from '@/src/components/3d/TarjetaModel'
import { ColorPicker } from '@/src/components/personalizar/ColorPicker'
import { ImageUploader } from '@/src/components/personalizar/ImageUploader'

const COLORES = [
  { nombre: 'Negro',  hex: '#391628' },
  { nombre: 'Azul',   hex: '#a5ccf4' },
  { nombre: 'Dorado', hex: '#f6c835' },
  { nombre: 'Rosa',   hex: '#fab2d3' },
  { nombre: 'Blanco', hex: '#6cc581' },
]

/**
 * TarjetaConfigurator: Page component allowing users to customize a 3D PVC card.
 * Users can pick a base background color and upload front/back image textures
 * to preview on the card in real-time.
 */
function TarjetaConfigurator() {
  const [color, setColor]               = useState(COLORES[0].hex) // Color state hook
  const [imagenFrente, setImagenFrente] = useState<string | null>(null) // State for the front cover image (Base64)
  const [imagenReverso, setImagenReverso] = useState<string | null>(null) // State for the back cover image (Base64)
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId') // Get productId from the URL search parameters

  /**
   * Saves customization choices to sessionStorage and forwards the user to the checkout page.
   */
  const handleComprar = () => {
    if (!productId) {
      router.push('/tienda')
      return
    }
    // Save selections. Images are omitted from sessionStorage as Base64 strings are too heavy.
    sessionStorage.setItem('pedido', JSON.stringify({
      producto: 'Tarjeta Personalizada',
      colorNombre: COLORES.find(c => c.hex === color)?.nombre,
      colorHex: color,
      tieneImagenFrente: !!imagenFrente,
      tieneImagenReverso: !!imagenReverso,
      precio: 19900,
    }))
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800 mb-8 flex items-center gap-1"
        >
          ← Volver a la tienda
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: 3D Card canvas preview */}
          <div className="bg-white rounded-3xl border border-gray-200 h-80 lg:h-[500px] lg:sticky lg:top-8">
            <ProductCanvas>
              <TarjetaModel
                color={color}
                frontImage={imagenFrente}
                backImage={imagenReverso}
              />
            </ProductCanvas>
          </div>

          {/* Right Column: Customization forms & options */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Tarjeta Personalizada
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Personaliza ambos lados con tus propias imágenes
              </p>
            </div>

            {/* Base card color swatches panel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Color de la tarjeta
              </h2>
              <ColorPicker
                colores={COLORES}
                colorSeleccionado={color}
                onChange={setColor}
              />
              <p className="text-xs text-gray-400 mt-3">
                Seleccionado: <span className="font-medium text-gray-600">
                  {COLORES.find(c => c.hex === color)?.nombre}
                </span>
              </p>
            </div>

            {/* Front & Back face image uploads */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
              <h2 className="text-sm font-medium text-gray-700">
                Personaliza las caras
              </h2>
              <ImageUploader
                label="Frente de la tarjeta"
                imageUrl={imagenFrente}
                onChange={setImagenFrente}
              />
              <ImageUploader
                label="Reverso de la tarjeta"
                imageUrl={imagenReverso}
                onChange={setImagenReverso}
              />
            </div>

            {/* Pricing details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precio total</span>
                <span className="text-2xl font-semibold text-gray-900">
                  $19.900 COP
                </span>
              </div>
            </div>

            <button
              onClick={handleComprar}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl
                         font-medium text-base hover:bg-gray-700
                         active:scale-95 transition-all duration-200"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PersonalizarTarjetaPage() {
  return (
    // Wrap configurator with Suspense to handle useSearchParams CSR hydration
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm text-gray-500">Cargando configurador...</div>}>
      <TarjetaConfigurator />
    </Suspense>
  )
}
