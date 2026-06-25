'use client'

import Link from 'next/link'
import { ProductCanvas } from '@/src/components/3d/ProductCanvas'
import { ManillaModel } from '@/src/components/3d/ManillaModel'
import { TarjetaModel } from '@/src/components/3d/TarjetaModel'

interface ProductCardProps {
  id: string
  nombre: string
  descripcion: string
  precio: string
  href: string
  modelType: 'manilla' | 'tarjeta'
  defaultColor: string
  caracteristicas: string[]
  colores: { hex: string }[]
}

export function ProductCard({
  nombre,
  descripcion,
  precio,
  href,
  modelType,
  caracteristicas,
  colores,
}: ProductCardProps) {
  return (
    <Link href={href} className="group" aria-label={`Ver ${nombre}`}>
      <div className="
        bg-white rounded-2xl border border-gray-100 overflow-hidden
        shadow-sm hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 cursor-pointer
      ">
        {/* Mini canvas 3D — altura fija, fondo oscuro tipo Horus */}
        <div className="h-56 bg-gradient-to-br from-gray-100 via-[#FAB2D380] to-gray-200 relative overflow-hidden">
          <ProductCanvas
            enableOrbit={false}
            cameraPosition={modelType === 'tarjeta' ? [0, 0.2, 4] : [0, 1.2, 5]}
          >
            {modelType === 'manilla' ? (
              <ManillaModel color="#A5CCF4" autoRotate={false} />
            ) : (
              <TarjetaModel color="#A5CCF4" autoRotate={false} />
            )}
          </ProductCanvas>
          {/* Glow sutil en hover */}
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-500 pointer-events-none
            bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.06),transparent_70%)]
          " />
        </div>

        {/* Contenido */}
        <div className="p-5">
          <h2 className="text-base font-semibold text-gray-900">{nombre}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{descripcion}</p>

          <ul className="mt-4 space-y-1.5">
            {caracteristicas.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400 text-xs">✓</span>
                {c}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-red-500">${precio}</span>
              <span className="text-xs text-gray-400 ml-1">COP</span>
            </div>
            <div className="flex gap-1.5">
              {colores.map((c) => (
                <span
                  key={c.hex}
                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
