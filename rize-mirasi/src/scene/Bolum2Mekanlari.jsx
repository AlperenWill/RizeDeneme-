import { useMemo } from 'react'

/**
 * Bolum2Mekanlari — Çay Bahçeleri (UNESCO teması)
 *  - CayBitkisi: büyük çay çalısı + sepet detayı
 *  - TasKopru: tek kemerli, harçsız taş örme köprü + altından dere
 */

function rnd(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function CayBitkisi({ mekan }) {
  const [kx, , kz] = mekan.konum
  // Çay sıraları: bitkinin etrafında paralel yeşil setler
  const siralar = useMemo(() => {
    const s = []
    for (let i = -4; i <= 4; i++) {
      s.push({ z: kz + i * 2.2, xOfset: rnd(i * 3.1) * 0.6 })
    }
    return s
  }, [kz])

  return (
    <group>
      {/* Çay sıraları (alçak, yuvarlatılmış kutular = budanmış çalılar) */}
      {siralar.map((r, i) => (
        <mesh key={i} castShadow receiveShadow position={[kx - 6 + r.xOfset, 0.45, r.z]}>
          <boxGeometry args={[12, 0.9, 1.2]} />
          <meshStandardMaterial color={i % 2 ? '#2f6b3a' : '#3e7a44'} roughness={1} flatShading />
        </mesh>
      ))}

      {/* İncelenecek ana çalı: iki yaprak bir tomurcuk */}
      <group position={[kx, 0.9, kz]}>
        <mesh castShadow>
          <sphereGeometry args={[0.9, 8, 6]} />
          <meshStandardMaterial color="#4a8f52" roughness={1} flatShading />
        </mesh>
        {/* Taze sürgünler */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} castShadow position={[Math.cos(i * 2.1) * 0.5, 0.8, Math.sin(i * 2.1) * 0.5]}>
            <coneGeometry args={[0.14, 0.6, 5]} />
            <meshStandardMaterial color="#8fd694" roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>

      {/* Bel sepeti (toplama geleneği) */}
      <group position={[kx + 2.2, 0, kz + 1.6]} rotation={[0, 0.6, 0]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.5, 0.35, 0.9, 8]} />
          <meshStandardMaterial color="#a97c50" roughness={1} flatShading />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <torusGeometry args={[0.5, 0.06, 6, 10]} />
          <meshStandardMaterial color="#8a6240" roughness={1} />
        </mesh>
        {/* Sepetten taşan yapraklar */}
        <mesh position={[0.1, 1.05, 0]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#8fd694" roughness={1} flatShading />
        </mesh>
      </group>
    </group>
  )
}

export function TasKopru({ mekan }) {
  const [kx, , kz] = mekan.konum
  // Kemer taşı dizisi: yarım daire üzerinde bloklar (harçsız kuru örme hissi)
  const kemerTaslari = useMemo(() => {
    const t = []
    const n = 11
    for (let i = 0; i <= n; i++) {
      const a = Math.PI * (i / n) // 0..PI
      t.push({
        y: Math.sin(a) * 2.2,
        x: Math.cos(a) * 2.2,
        donme: a - Math.PI / 2,
        renk: ['#9aa0ab', '#8a8f98', '#a8adb6'][i % 3],
      })
    }
    return t
  }, [])

  return (
    <group>
      {/* Dere yatağı */}
      <mesh receiveShadow position={[kx, 0.05, kz]}>
        <boxGeometry args={[9, 0.3, 4.5]} />
        <meshStandardMaterial color="#6b7a85" roughness={1} flatShading />
      </mesh>
      {/* Akan su */}
      <mesh position={[kx, 0.22, kz]}>
        <planeGeometry args={[9, 3.2]} />
        <meshStandardMaterial color="#2e7d99" roughness={0.2} metalness={0.4} transparent opacity={0.85} />
      </mesh>

      {/* Kemer blokları (köprü yan görünümde, x ekseni boyunca) */}
      {kemerTaslari.map((t, i) => (
        <mesh
          key={i}
          castShadow
          position={[kx + t.x, 0.4 + t.y, kz]}
          rotation={[0, 0, t.donme]}
        >
          <boxGeometry args={[0.62, 0.62, 2.6]} />
          <meshStandardMaterial color={t.renk} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Köprü yolu (kemer üstü dolgu) */}
      <mesh castShadow receiveShadow position={[kx, 2.75, kz]}>
        <boxGeometry args={[4.6, 0.35, 2.6]} />
        <meshStandardMaterial color="#7e848d" roughness={1} flatShading />
      </mesh>
      {/* Yolun rampaları */}
      <mesh castShadow position={[kx - 2.6, 2.2, kz]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[1.6, 0.3, 2.6]} />
        <meshStandardMaterial color="#8a8f98" roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[kx + 2.6, 2.2, kz]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[1.6, 0.3, 2.6]} />
        <meshStandardMaterial color="#8a8f98" roughness={1} flatShading />
      </mesh>

      {/* Kilit taşı vurgusu */}
      <mesh castShadow position={[kx, 2.65, kz]}>
        <boxGeometry args={[0.7, 0.7, 2.7]} />
        <meshStandardMaterial color="#c2c7d0" roughness={1} flatShading />
      </mesh>

      {/* Kenar korkuluk taşları */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <group key={i}>
          <mesh castShadow position={[kx + i, 3.05, kz - 1.2]}>
            <boxGeometry args={[0.5, 0.4, 0.25]} />
            <meshStandardMaterial color="#9aa0ab" roughness={1} flatShading />
          </mesh>
          <mesh castShadow position={[kx + i, 3.05, kz + 1.2]}>
            <boxGeometry args={[0.5, 0.4, 0.25]} />
            <meshStandardMaterial color="#9aa0ab" roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}
