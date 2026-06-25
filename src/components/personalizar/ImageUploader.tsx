'use client'

import { useRef } from 'react'

interface ImageUploaderProps {
  label: string                   // "Frente de la tarjeta" o "Reverso"
  imageUrl: string | null         // base64 actual (null si no hay imagen)
  onChange: (url: string) => void // Devuelve el base64 al componente padre
}

export function ImageUploader({ label, imageUrl, onChange }: ImageUploaderProps) {
  // Ref al input file oculto para dispararlo desde el botón visible
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    /*
      FileReader es la API del navegador para leer archivos locales
      readAsDataURL convierte el archivo a base64 (formato: "data:image/png;base64,...")
      Three.js TextureLoader acepta URLs base64 directamente
      Esto evita tener que subir la imagen a un servidor para previsualizarla
    */
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange(ev.target.result as string) // Envía el base64 al padre
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Etiqueta del campo */}
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {/* Botón visible que abre el selector de archivos del OS */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4
                   text-sm text-gray-500 hover:border-gray-500 hover:text-gray-700
                   hover:bg-gray-50 transition-all text-center"
      >
        {imageUrl
          ? '✓ Imagen cargada — clic para cambiar'
          : '+ Subir imagen'}
      </button>

      {/* Input file real, invisible, solo acepta imágenes */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Preview de la imagen cargada */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`Preview ${label}`}
          className="w-full h-24 object-cover rounded-xl border border-gray-200"
        />
      )}
    </div>
  )
}
