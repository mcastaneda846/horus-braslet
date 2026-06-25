'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TarjetaModelProps {
  color: string // Base background color of the card
  frontImage?: string | null // Data URL or path of the uploaded front cover texture image
  backImage?: string | null // Data URL or path of the uploaded back cover texture image
  autoRotate?: boolean // Toggle slow rotation animation
}

/**
 * TarjetaModel: Procedurally generates a 3D rectangular PVC card model.
 * Loads dynamic images as textures on the front and back faces of the card box mesh.
 */
export function TarjetaModel({ color, frontImage, backImage, autoRotate = true }: TarjetaModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  // React state variables to hold compiled ThreeJS textures
  const [frontTex, setFrontTex] = useState<THREE.Texture | null>(null)
  const [backTex, setBackTex] = useState<THREE.Texture | null>(null)

  // Dynamic side effect to load the front texture asynchronously using TextureLoader
  useEffect(() => {
    if (!frontImage) return
    const loader = new THREE.TextureLoader()
    let active = true
    loader.load(frontImage, (tex) => {
      if (active) setFrontTex(tex)
    })
    return () => { active = false; setFrontTex(null) }
  }, [frontImage])

  // Dynamic side effect to load the back texture asynchronously using TextureLoader
  useEffect(() => {
    if (!backImage) return
    const loader = new THREE.TextureLoader()
    let active = true
    loader.load(backImage, (tex) => {
      if (active) setBackTex(tex)
    })
    return () => { active = false; setBackTex(null) }
  }, [backImage])

  // Frame loop animation: handles Y rotation and gentle vertical hover floating
  useFrame((_, delta) => {
    timeRef.current += delta
    if (!meshRef.current) return
    if (autoRotate) {
      meshRef.current.rotation.y += delta * 0.35
    }
    // Smooth floating animation using standard mathematical sine wave
    meshRef.current.position.y = Math.sin(timeRef.current * 0.9) * 0.07
  })

  /**
   * Material array for THREE.BoxGeometry mapping:
   * Index 0-3: Edges of the card (Right, Left, Top, Bottom)
   * Index 4: Front face of the card (Z-positive)
   * Index 5: Back face of the card (Z-negative)
   */
  const materials = [
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({
      ...(frontTex ? { map: frontTex } : {}),
      color: frontTex ? '#ffffff' : color, // Use white filter to overlay original colors of custom texture
      roughness: 0.15,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      ...(backTex ? { map: backTex } : {}),
      color: backTex ? '#ffffff' : color, // Use white filter to overlay original colors of custom texture
      roughness: 0.15,
      metalness: 0.2,
    }),
  ]

  return (
    /*
      Initial orientation: small tilt on X-axis and 3/4 turn on Y-axis.
      - autoRotate=true: slow rotation starts from this angle.
      - autoRotate=false: stays statically tilted in a beautiful 3D isometric view.
    */
    <mesh ref={meshRef} material={materials} rotation={[0.18, Math.PI * 0.17, 0]}>
      <boxGeometry args={[2.8, 1.76, 0.03]} />
    </mesh>
  )
}
