'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TarjetaModelProps {
  color: string
  frontImage?: string | null
  backImage?: string | null
  autoRotate?: boolean
}

export function TarjetaModel({ color, frontImage, backImage, autoRotate = true }: TarjetaModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const [frontTex, setFrontTex] = useState<THREE.Texture | null>(null)
  const [backTex, setBackTex] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!frontImage) return
    const loader = new THREE.TextureLoader()
    let active = true
    loader.load(frontImage, (tex) => {
      if (active) setFrontTex(tex)
    })
    return () => { active = false; setFrontTex(null) }
  }, [frontImage])

  useEffect(() => {
    if (!backImage) return
    const loader = new THREE.TextureLoader()
    let active = true
    loader.load(backImage, (tex) => {
      if (active) setBackTex(tex)
    })
    return () => { active = false; setBackTex(null) }
  }, [backImage])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (!meshRef.current) return
    if (autoRotate) {
      meshRef.current.rotation.y += delta * 0.35
    }
    // Flotación suave sin Float de drei
    meshRef.current.position.y = Math.sin(timeRef.current * 0.9) * 0.07
  })

  const materials = [
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({
      ...(frontTex ? { map: frontTex } : {}),
      color: frontTex ? '#ffffff' : color,
      roughness: 0.15,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      ...(backTex ? { map: backTex } : {}),
      color: backTex ? '#ffffff' : color,
      roughness: 0.15,
      metalness: 0.2,
    }),
  ]

  return (
    /*
      rotation inicial: leve tilt en X + ángulo en Y
      - autoRotate=true (configurador): useFrame suma a rotation.y → gira desde ese ángulo
      - autoRotate=false (tienda): queda estático en este ángulo de 3/4, se ve 3D
    */
    <mesh ref={meshRef} material={materials} rotation={[0.18, Math.PI * 0.17, 0]}>
      <boxGeometry args={[2.8, 1.76, 0.03]} />
    </mesh>
  )
}
