import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useOyunStore } from '../store/useOyunStore'

/**
 * Hotspot — Önemli nesnelerde kırmızı (#F04448) "nefes alan" daire.
 * Her zaman kameraya dönük (billboard), keşfedilince yeşile döner.
 */
export default function Hotspot({ konum, yukseklik = 2.6, mekanId }) {
  const grup = useRef()
  const halka = useRef()
  const cekirdek = useRef()
  const kamera = useRef(null)
  const kesifli = useOyunStore((s) => s.keşif[mekanId])

  useFrame(({ camera, clock }, dt) => {
    if (!grup.current) return
    // Billboard: hotspot her zaman bakışa dik
    grup.current.quaternion.copy(camera.quaternion)
    const t = clock.getElapsedTime()
    // Nefes alma animasyonu (scale + opacity)
    const nefes = 1 + Math.sin(t * 2.2) * 0.18
    if (halka.current) {
      halka.current.scale.setScalar(nefes)
      halka.current.material.opacity = 0.55 - Math.sin(t * 2.2) * 0.25
    }
    if (cekirdek.current) {
      cekirdek.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08)
    }
  })

  const renk = kesifli ? '#3DDC97' : '#F04448'

  return (
    <group ref={grup} position={[konum[0], yukseklik, konum[2]]}>
      {/* Dış nefes halkası */}
      <mesh ref={halka}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshBasicMaterial color={renk} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* İç çekirdek daire */}
      <mesh ref={cekirdek}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color={renk} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Keşif durumu simgesi için beyaz nokta */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}
