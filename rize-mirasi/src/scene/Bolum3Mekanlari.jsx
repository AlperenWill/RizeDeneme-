import { useMemo } from 'react'

/**
 * Bolum3Mekanlari — Zilkale ve Doğa (Fırtına Vadisi)
 *  - Zilkale: yüksek kayalık üzerinde dış sur + iç kale + 7 katlı kulenin kalıntısı
 *  - DereKenari: Fırtına Deresi, çakıl taşları, sis atmosferi
 */

function rnd(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function Zilkale({ mekan }) {
  const [kx, , kz] = mekan.konum

  // Dış surlar: kayalık tepede oval dizilim
  const surDizisi = useMemo(() => {
    const pts = []
    const n = 10
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      pts.push([kx + Math.cos(a) * 6.5, kz + Math.sin(a) * 4.5])
    }
    return pts
  }, [kx, kz])

  return (
    <group>
      {/* Vadiyi çevreleyen yüksek kayalıklar */}
      <mesh castShadow receiveShadow position={[kx - 14, 9, kz - 6]} rotation={[0, 0.5, 0.08]}>
        <coneGeometry args={[9, 22, 6]} />
        <meshStandardMaterial color="#5c6470" roughness={1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[kx + 15, 8, kz - 10]} rotation={[0, -0.4, -0.06]}>
        <coneGeometry args={[8, 19, 6]} />
        <meshStandardMaterial color="#4f5763" roughness={1} flatShading />
      </mesh>

      {/* Kalenin oturduğu kayalık kaya kütlesi */}
      <mesh castShadow receiveShadow position={[kx, 2.5, kz]}>
        <cylinderGeometry args={[8, 10.5, 7, 7]} />
        <meshStandardMaterial color="#6b7280" roughness={1} flatShading />
      </mesh>

      {/* Dış sur duvarları (kayalık üstünde) */}
      {surDizisi.map((p, i) => {
        const q = surDizisi[(i + 1) % surDizisi.length]
        const dx = q[0] - p[0]
        const dz = q[1] - p[1]
        const l = Math.hypot(dx, dz)
        return (
          <mesh
            key={i}
            castShadow
            position={[(p[0] + q[0]) / 2, 6.9, (p[1] + q[1]) / 2]}
            rotation={[0, -Math.atan2(dz, dx), 0]}
          >
            <boxGeometry args={[l, 2.2, 0.8]} />
            <meshStandardMaterial color={['#9aa0ab', '#8a8f98'][i % 2]} roughness={1} flatShading />
          </mesh>
        )
      })}

      {/* İç kale — yedi katlı bey konağı kulesi (kısmen yıkık) */}
      <group position={[kx, 8, kz]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const h = 1.5 - i * 0.12
          const w = 3 - i * 0.35
          const kirik = i >= 3 ? 0.55 : 1 // üst katlar yıkık: kısa blok
          return (
            <mesh key={i} castShadow position={[i * 0.08, 0.75 + i * 1.45, 0]}>
              <boxGeometry args={[w, h * kirik + (kirik < 1 ? 0.4 : 0), w * 0.8]} />
              <meshStandardMaterial color={['#a8adb6', '#9aa0ab', '#8a8f98'][i % 3]} roughness={1} flatShading />
            </mesh>
          )
        })}
        {/* Penceres açıklıkları hissi için koyu kutular */}
        {[0, 1, 2].map((i) => (
          <mesh key={`p${i}`} position={[-1.1, 1.6 + i * 1.4, 1.05]}>
            <boxGeometry args={[0.35, 0.6, 0.12]} />
            <meshStandardMaterial color="#22262e" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Kale kapısı */}
      <mesh position={[kx, 6.6, kz + 4.5]}>
        <boxGeometry args={[1.6, 2, 1]} />
        <meshStandardMaterial color="#3a2f27" roughness={1} />
      </mesh>
    </group>
  )
}

export function DereKenari({ mekan }) {
  const [kx, , kz] = mekan.konum

  const cakil = useMemo(() => {
    const t = []
    for (let i = 0; i < 14; i++) {
      t.push({
        x: kx - 3 + rnd(i * 2.3) * 6,
        z: kz - 3 + rnd(i * 5.1) * 6,
        s: 0.25 + rnd(i * 9.7) * 0.45,
      })
    }
    return t
  }, [kx, kz])

  return (
    <group>
      {/* Dere yatağı — kıvrımlı basit iki segment */}
      <mesh receiveShadow position={[kx, 0.08, kz]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[14, 0.35, 4.2]} />
        <meshStandardMaterial color="#5d6b76" roughness={1} flatShading />
      </mesh>
      {/* Su yüzeyi (hafif parlak) */}
      <mesh position={[kx, 0.3, kz]} rotation={[-Math.PI / 2, 0, 0.35]}>
        <planeGeometry args={[13.6, 3.6]} />
        <meshStandardMaterial
          color="#3f9db8"
          roughness={0.15}
          metalness={0.35}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Çakıl taşları */}
      {cakil.map((c, i) => (
        <mesh key={i} castShadow position={[c.x, 0.15 + c.s * 0.2, c.z]} scale={c.s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={['#8a8f98', '#9aa0ab', '#7e848d'][i % 3]} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Kenar kayın ağaçları gölgesi: iki ince gövde */}
      {[
        [kx - 4.5, kz - 3.2],
        [kx + 4.2, kz + 3.4],
      ].map(([ax, az], i) => (
        <group key={i} position={[ax, 0, az]}>
          <mesh castShadow position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.16, 0.24, 3.2, 6]} />
            <meshStandardMaterial color="#5b4634" roughness={1} />
          </mesh>
          <mesh castShadow position={[0, 3.6, 0]}>
            <coneGeometry args={[1.1, 2.4, 6]} />
            <meshStandardMaterial color="#2f6b3a" roughness={1} flatShading />
          </mesh>
        </group>
      ))}

      {/* Alabalık simgesi: su üstünde küçük balık şekli */}
      <mesh position={[kx + 1, 0.34, kz + 0.5]} rotation={[0, 0.8, 0]}>
        <coneGeometry args={[0.18, 0.7, 5]} />
        <meshStandardMaterial color="#d9e2ec" roughness={0.6} flatShading />
      </mesh>
    </group>
  )
}
