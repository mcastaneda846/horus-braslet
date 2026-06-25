'use client'

interface Color {
  nombre: string
  hex: string
}

interface ColorPickerProps {
  colores: Color[]
  colorSeleccionado: string
  onChange: (hex: string) => void
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export function ColorPicker({ colores, colorSeleccionado, onChange, size = 'md' }: ColorPickerProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {colores.map((c) => (
        <button
          key={c.hex}
          type="button"
          title={c.nombre}
          onClick={() => onChange(c.hex)}
          aria-label={`Color ${c.nombre}`}
          className={`
            ${SIZES[size]} rounded-full transition-all duration-200
            ${colorSeleccionado === c.hex
              ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
              : 'hover:scale-105 ring-1 ring-gray-200'
            }
          `}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  )
}
