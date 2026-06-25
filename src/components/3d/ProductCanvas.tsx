'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

/**
 * Properties for the 3D Product Canvas Container
 */
interface ProductCanvasProps {
  children: React.ReactNode
  enableOrbit?: boolean // Toggle user orbit rotation controls
  cameraPosition?: [number, number, number] // Position of the perspective camera
  frameloop?: 'always' | 'demand' | 'never' // Rendering loop style for performance optimization
}

/**
 * ProductCanvas component: Renders a WebGL canvas with standard studio lighting,
 * high-performance parameters, environmental reflection preset, and restricted orbital controls.
 */
export function ProductCanvas({
  children,
  enableOrbit = true,
  cameraPosition = [0, 0, 4],
  frameloop = 'always',
}: ProductCanvasProps) {
  return (
    <div className="w-full h-full">
      {/* Configure R3F Canvas with antialiasing and low-power preference for mobile devices */}
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        frameloop={frameloop}
      >
        {/* Suspense fallback for dynamic 3D asset loaders */}
        <Suspense fallback={null}>
          {/* Main lighting configuration to show textures and metallic shine */}
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, -5]} intensity={0.4} />
          <directionalLight position={[0, 3, 6]} intensity={1.0} />
          
          {/* Preset HDRI environment for beautiful reflections on shiny materials */}
          <Environment preset="studio" />

          {children}

          {/* Restrict camera rotation so the user cannot pan or look completely underneath the 3D model */}
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
