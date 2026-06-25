'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ManillaModelProps {
  color: string // Base color of the silicone band
  autoRotate?: boolean // Toggle slow rotation animation
}

/**
 * ManillaModel: Procedurally generates a 3D medical bracelet model.
 * Constructs an extruded band curve, steel plating, connection tabs, pins, and custom materials.
 */
export function ManillaModel({ color, autoRotate = true }: ManillaModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // ── SILICONE BAND EXTRUSION ───────────────────────────────────────
  // Creates a circular path curve with a frontal gap where the steel buckle fits.
  const bandGeo = useMemo(() => {
    const gapAngle = 0.44 // Gap angle for the plate (approx 25 degrees)
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

    // Rounded rectangular shape profile for the band's cross-section
    const bw = 0.14   // Half-width (along the Z axis)
    const bh = 0.032  // Half-thickness (radial direction)
    const cr = 0.010  // Corner rounding radius

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

  // ── METAL PLATE BASE GEOMETRY ─────────────────────────────────────
  // Main body of the steel buckle: X = length, Y = thickness, Z = width
  const plateGeo = useMemo(() =>
    new THREE.BoxGeometry(0.52, 0.072, 0.30), [])

  // ── ENGRAVING INSET AREA ──────────────────────────────────────────
  // The upper face of the plate dedicated for laser engraving (slightly inset)
  const plateInsetGeo = useMemo(() =>
    new THREE.BoxGeometry(0.42, 0.008, 0.24), [])

  // ── SHACKLE PINS ──────────────────────────────────────────────────
  // Cylindrical steel pins connecting the buckle to the band (runs along the Z axis)
  const pinGeo = useMemo(() =>
    new THREE.CylinderGeometry(0.018, 0.018, 0.34, 16), [])

  // ── CONNECTION TABS ───────────────────────────────────────────────
  // End pieces of the silicone band that wrap around the metal shackle
  const tabGeo = useMemo(() =>
    new THREE.BoxGeometry(0.14, 0.068, 0.30), [])

  // Animation frame loop: handles slow Y rotation and floating effect
  useFrame((_, delta) => {
    timeRef.current += delta
    if (!groupRef.current) return
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.38
    }
    // Floating bounce up and down using a sine wave
    groupRef.current.position.y = Math.sin(timeRef.current * 0.85) * 0.05
  })

  // ── MATERIALS DEFINITION ──────────────────────────────────────────
  // Matte texture for the silicone band
  const bandMat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.0,
  }), [color])

  // Metallic reflective texture for the steel plate & pins
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b8bfc8',
    roughness: 0.15,
    metalness: 0.95,
  }), [])

  // Inset engraving plate material (brushed metal look)
  const plateSurfaceMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d2d8e0',
    roughness: 0.22,
    metalness: 0.88,
  }), [])

  // Y coordinate position of the plate relative to the circle (top position)
  const plateY = 1.0

  return (
    <group ref={groupRef} rotation={[Math.PI * 0.30, 0, 0.10]}>

      {/* Silicone band mesh */}
      <mesh geometry={bandGeo} material={bandMat} />

      {/* Left silicone tab */}
      <mesh geometry={tabGeo} material={bandMat}
        position={[-0.28, plateY, 0]} />

      {/* Right silicone tab */}
      <mesh geometry={tabGeo} material={bandMat}
        position={[ 0.28, plateY, 0]} />

      {/* Stainless steel main buckle plate */}
      <mesh geometry={plateGeo} material={metalMat}
        position={[0, plateY, 0]} />

      {/* Engravable face plate */}
      <mesh geometry={plateInsetGeo} material={plateSurfaceMat}
        position={[0, plateY + 0.038, 0]} />

      {/* Left pin (runs in Z axis) */}
      <mesh geometry={pinGeo} material={metalMat}
        position={[-0.23, plateY, 0]}
        rotation={[Math.PI / 2, 0, 0]} />

      {/* Right pin (runs in Z axis) */}
      <mesh geometry={pinGeo} material={metalMat}
        position={[ 0.23, plateY, 0]}
        rotation={[Math.PI / 2, 0, 0]} />

    </group>
  )
}
