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

function TarjetaConfigurator() {
  const [color, setColor]               = useState(COLORES[0].hex)
  const [imagenFrente, setImagenFrente] = useState<string | null>(null)
  const [imagenReverso, setImagenReverso] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const handleComprar = () => {
    if (!productId) {
      router.push('/tienda')
      return
    }
    sessionStorage.setItem('pedido', JSON.stringify({
      producto: 'Tarjeta Personalizada',
      colorNombre: COLORES.find(c => c.hex === color)?.nombre,
      colorHex: color,
      tieneImagenFrente: !!imagenFrente,
      tieneImagenReverso: !!imagenReverso,
      precio: 19900,
    }))
    // Nota: no guardamos las imágenes en sessionStorage (son muy pesadas en base64)
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
          {/* Canvas 3D de la tarjeta */}
          <div className="bg-white rounded-3xl border border-gray-200 h-80 lg:h-[500px] lg:sticky lg:top-8">
            <ProductCanvas>
              <TarjetaModel
                color={color}
                frontImage={imagenFrente}
                backImage={imagenReverso}
              />
            </ProductCanvas>
          </div>

          {/* Panel de personalización */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Tarjeta Personalizada
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Personaliza ambos lados con tus propias imágenes
              </p>
            </div>

            {/* Color base de la tarjeta */}
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

            {/* Subida de imágenes para ambas caras */}
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
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm text-gray-500">Cargando configurador...</div>}>
      <TarjetaConfigurator />
    </Suspense>
  )
}
