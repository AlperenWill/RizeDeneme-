import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Low-poly zemin: segmentli düzlem üzerinde deterministik (seed'li) tepeçiklar.
 * Rize'nin yeşil tepeleri hissi için yavaş dalga fonksiyonları kullanılır.
 * Deniz tarafı (z > denizKenari) sabit ve düzdür.
 */
export default function Terrain({
  renk = '#3e7a44',
  boyut = 90,
  segment = 48,
  yukseklik = 2.6,
  denizKenari = 24, // bu z değerinden sonrası deniz (düz kalır)
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(boyut, boyut, segment, segment)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      if (z > denizKenari - 2) continue // sahil düz kalsın
      const s = Math.max(0, (denizKenari - 2 - z) / boyut) // sahilden içeri artan ağırlık
      const h =
        Math.sin(x * 0.12 + 1.3) * Math.cos(z * 0.1) * 0.5 +
        Math.sin(x * 0.31 + z * 0.21) * 0.25 +
        Math.cos(z * 0.07) * 0.35
      pos.setY(i, h * yukseklik * s)
    }
    g.computeVertexNormals()
    return g
  }, [renk, boyut, segment, yukseklik, denizKenari])

  return (
    <mesh geometry={geo} receiveShadow position={[0, 0, 0]}>
      <meshStandardMaterial color={renk} roughness={0.95} metalness={0} flatShading />
    </mesh>
  )
}
