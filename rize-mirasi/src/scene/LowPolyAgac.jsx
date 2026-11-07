import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * LowPolyAgac — deterministik konumlu basıl ağaç (gövde + 2-3 yaprak konisi).
 * Instanced yerine grup; sahne başına ~40 adet ile sınırlandı.
 */
export default function LowPolyAgac({
  position = [0, 0, 0],
  renkGovde = '#5b4634',
  renkYaprak = '#2f6b3a',
  olcek = 1,
}) {
  // Deterministik mini "seed" konuma göre
  const d = useMemo(() => {
    const s = Math.abs(Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453) % 1
    return s
  }, [position])

  const y = 1.2 + d * 0.9
  return (
    <group position={position} scale={olcek}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 1.2, 5]} />
        <meshStandardMaterial color={renkGovde} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.2 + y * 0.35, 0]}>
        <coneGeometry args={[0.85, y, 6]} />
        <meshStandardMaterial color={renkYaprak} roughness={0.9} flatShading />
      </mesh>
      {d > 0.4 && (
        <mesh castShadow position={[0, 1.2 + y * 0.9, 0]}>
          <coneGeometry args={[0.55, y * 0.75, 6]} />
          <meshStandardMaterial color={renkYaprak} roughness={0.9} flatShading />
        </mesh>
      )}
    </group>
  )
}
