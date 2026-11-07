import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Deniz — bası düz yansımalı yüzey + hafif dalga animasyonu (vertex offset).
 * Low-poly: segment sayısı düşük tutuldu.
 */
export default function Sea({ konum = [0, -0.15, 46], boyut = 120 }) {
  const mesh = useRef()

  useFrame(({ clock }) => {
    const g = mesh.current?.geometry
    if (!g) return
    const t = clock.getElapsedTime()
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, Math.sin(x * 0.35 + t * 1.1) * 0.08 + Math.cos(z * 0.3 + t * 0.8) * 0.07)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh ref={mesh} position={konum} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[boyut, boyut, 24, 24]} />
      <meshStandardMaterial
        color="#1e5f74"
        roughness={0.25}
        metalness={0.55}
        transparent
        opacity={0.92}
        flatShading
      />
    </mesh>
  )
}
