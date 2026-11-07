import { useMemo } from 'react'

/**
 * Tas — deterministik konum/renk ile low-poly kaya (icosahedron, flat shading).
 */
export default function Tas({ position = [0, 0, 0], olcek = 1, renk = '#8a8f98', donme = 0 }) {
  const d = useMemo(() => {
    const s = Math.abs(Math.sin(position[0] * 45.164 + position[2] * 93.987) * 24634.6345) % 1
    return s
  }, [position])

  return (
    <mesh
      castShadow
      receiveShadow
      position={[position[0], (position[1] ?? 0) + olcek * 0.35, position[2]]}
      rotation={[d * 0.6, donme + d * 3.1, d * 0.4]}
      scale={[olcek * (0.8 + d * 0.5), olcek * (0.6 + d * 0.4), olcek]}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={renk} roughness={1} flatShading />
    </mesh>
  )
}
