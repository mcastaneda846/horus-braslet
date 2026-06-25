'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

interface ProductCanvasProps {
  children: React.ReactNode
  enableOrbit?: boolean
  cameraPosition?: [number, number, number]
  frameloop?: 'always' | 'demand' | 'never'
}

export function ProductCanvas({
  children,
  enableOrbit = true,
  cameraPosition = [0, 0, 4],
  frameloop = 'always',
}: ProductCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        frameloop={frameloop}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, -5]} intensity={0.4} />
          <directionalLight position={[0, 3, 6]} intensity={1.0} />
          <Environment preset="studio" />

          {children}

          {enableOrbit && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
