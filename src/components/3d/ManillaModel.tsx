'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ManillaModelProps {
  color: string
  autoRotate?: boolean
}

export function ManillaModel({ color, autoRotate = true }: ManillaModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // ── BANDA DE SILICONA ─────────────────────────────────────────────
  // Curva circular con hueco frontal donde va la hebilla
  const bandGeo = useMemo(() => {
    const gapAngle = 0.44 // hueco para la placa (~25°)
    const startAngle = Math.PI / 2 + gapAngle / 2
    const endAngle   = Math.PI / 2 - gapAngle / 2 + Math.PI * 2
    const radius = 1.0
    const segments = 128

    const points: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = startAngle + t * (endAngle - startAngle)
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ))
    }
    const curve = new THREE.CatmullRomCurve3(points, false)

    // Perfil rectangular redondeado (sección de banda plana)
    const bw = 0.14   // mitad del ancho (eje Z)
    const bh = 0.032  // mitad del grosor radial
    const cr = 0.010  // radio de esquina

    const profileShape = new THREE.Shape()
    profileShape.moveTo(-bw + cr, -bh)
    profileShape.lineTo( bw - cr, -bh)
    profileShape.quadraticCurveTo( bw, -bh,  bw, -bh + cr)
    profileShape.lineTo( bw,  bh - cr)
    profileShape.quadraticCurveTo( bw,  bh,  bw - cr,  bh)
    profileShape.lineTo(-bw + cr,  bh)
    profileShape.quadraticCurveTo(-bw,  bh, -bw,  bh - cr)
    profileShape.lineTo(-bw, -bh + cr)
    profileShape.quadraticCurveTo(-bw, -bh, -bw + cr, -bh)

    return new THREE.ExtrudeGeometry(profileShape, {
      extrudePath: curve,
      steps: 128,
      bevelEnabled: false,
    })
  }, [])

  // ── CUERPO PRINCIPAL DE LA PLACA ─────────────────────────────────
  // Dimensiones: X=largo (a lo ancho del aro), Y=grosor radial, Z=ancho de banda
  // Se rota -90° en X para que quede tendida sobre la banda
  const plateGeo = useMemo(() =>
    new THREE.BoxGeometry(0.52, 0.072, 0.30), [])

  // ── SUPERFICIE GRABABLE ───────────────────────────────────────────
  // Cara superior de la placa (Y positivo después de la rotación)
  const plateInsetGeo = useMemo(() =>
    new THREE.BoxGeometry(0.42, 0.008, 0.24), [])

  // ── PASADORES: ahora corren en Z (a lo largo del ancho de la banda)
  const pinGeo = useMemo(() =>
    new THREE.CylinderGeometry(0.018, 0.018, 0.34, 16), [])

  // ── OREJETAS de silicona: anchas en Z, delgadas en Y ─────────────
  const tabGeo = useMemo(() =>
    new THREE.BoxGeometry(0.14, 0.068, 0.30), [])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (!groupRef.current) return
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.38
    }
    groupRef.current.position.y = Math.sin(timeRef.current * 0.85) * 0.05
  })

  const bandMat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.0,
  }), [color])

  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b8bfc8',
    roughness: 0.15,
    metalness: 0.95,
  }), [])

  const plateSurfaceMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d2d8e0',
    roughness: 0.22,
    metalness: 0.88,
  }), [])

  // La placa queda en la parte superior del aro (y = +1.0)
  const plateY = 1.0

  return (
    <group ref={groupRef} rotation={[Math.PI * 0.30, 0, 0.10]}>

      {/* Banda de silicona */}
      <mesh geometry={bandGeo} material={bandMat} />

      {/* Orejeta izquierda — donde la banda entra en la hebilla */}
      <mesh geometry={tabGeo} material={bandMat}
        position={[-0.28, plateY, 0]} />

      {/* Orejeta derecha */}
      <mesh geometry={tabGeo} material={bandMat}
        position={[ 0.28, plateY, 0]} />

      {/* Cuerpo de la placa metálica — horizontal sobre la banda */}
      <mesh geometry={plateGeo} material={metalMat}
        position={[0, plateY, 0]} />

      {/* Superficie grabable — cara superior (Y+) de la placa */}
      <mesh geometry={plateInsetGeo} material={plateSurfaceMat}
        position={[0, plateY + 0.038, 0]} />

      {/* Pasador izquierdo — corre en Z (a lo ancho de la banda) */}
      <mesh geometry={pinGeo} material={metalMat}
        position={[-0.23, plateY, 0]}
        rotation={[Math.PI / 2, 0, 0]} />

      {/* Pasador derecho */}
      <mesh geometry={pinGeo} material={metalMat}
        position={[ 0.23, plateY, 0]}
        rotation={[Math.PI / 2, 0, 0]} />

    </group>
  )
}
