import { useMemo } from 'react'

/**
 * Bolum1Mekanlari — Rize Sahili ve Tarihi Kale (bölüm 1 nesneleri).
 *  - RizeKalesi: tepe üzerinde Bizans surları + burçlar (taş işçiliği hissi)
 *  - TarihiIskele: ahşap iskele + bağlama direkleri
 *  - Sahil taşı zemin, yeşil tepeler, deniz arka planda
 */

// Deterministik sözde-rastgele (her render aynı olsun)
function rnd(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const TAS_RENKLER = ['#9aa0ab', '#8a8f98', '#a8adb6', '#7e848d']

function Sur({ baslangic, bitis, yukseklik = 3, kalinlik = 0.9 }) {
  const dx = bitis[0] - baslangic[0]
  const dz = bitis[2] - baslangic[2]
  const uzunluk = Math.hypot(dx, dz)
  const aci = Math.atan2(dz, dx)
  const orta = [(baslangic[0] + bitis[0]) / 2, (baslangic[2] + bitis[2]) / 2]
  const taslar = useMemo(() => {
    const t = []
    const adet = Math.floor(uzunluk / 1.1)
    for (let i = 0; i < adet; i++) {
      const p = (i + 0.5) / adet
      t.push({
        konum: [baslangic[0] + dx * p, 0, baslangic[2] + dz * p],
        olcek: 0.5 + rnd(i + uzunluk) * 0.25,
        renk: TAS_RENKLER[Math.floor(rnd(i * 3.3) * TAS_RENKLER.length)],
      })
    }
    return t
  }, [baslangic, bitis, uzunluk, dx, dz])

  return (
    <group>
      {/* Ana sur gövdesi */}
      <mesh castShadow receiveShadow position={[orta[0], yukseklik / 2, orta[1]]} rotation={[0, -aci, 0]}>
        <boxGeometry args={[uzunluk, yukseklik, kalinlik]} />
        <meshStandardMaterial color="#8a8f98" roughness={1} flatShading />
      </mesh>
      {/* Dişler (mazgallar) */}
      {taslar.map((t, i) => (
        <mesh key={i} castShadow position={[t.konum[0], yukseklik + 0.3, t.konum[2]]}>
          <boxGeometry args={[0.55, 0.6, kalinlik]} />
          <meshStandardMaterial color={t.renk} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Burc({ konum, yukseklik = 5.5, yariCap = 1.3 }) {
  return (
    <group position={konum}>
      <mesh castShadow receiveShadow position={[0, yukseklik / 2, 0]}>
        <cylinderGeometry args={[yariCap, yariCap * 1.15, yukseklik, 8]} />
        <meshStandardMaterial color="#9aa0ab" roughness={1} flatShading />
      </mesh>
      {/* Mazgal halkası */}
      <mesh castShadow position={[0, yukseklik + 0.25, 0]}>
        <cylinderGeometry args={[yariCap * 1.18, yariCap * 1.18, 0.5, 8]} />
        <meshStandardMaterial color="#7e848d" roughness={1} flatShading />
      </mesh>
      {/* Bayrak direği */}
      <mesh position={[0, yukseklik + 1.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 4]} />
        <meshStandardMaterial color="#5b4634" roughness={1} />
      </mesh>
      <mesh position={[0.35, yukseklik + 2.05, 0]}>
        <planeGeometry args={[0.7, 0.45]} />
        <meshStandardMaterial color="#F04448" side={2} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function RizeKalesi({ mekan }) {
  const [kx, , kz] = mekan.konum
  // Kale tepe'nin üstünde: zemini yükselt
  return (
    <group>
      {/* Yeşil tepe */}
      <mesh receiveShadow castShadow position={[kx, 1.4, kz]}>
        <coneGeometry args={[11, 4.2, 10]} />
        <meshStandardMaterial color="#3e7a44" roughness={1} flatShading />
      </mesh>
      {/* Taş temel platformu */}
      <mesh receiveShadow position={[kx, 3.6, kz]}>
        <cylinderGeometry args={[7.6, 8.2, 0.7, 10]} />
        <meshStandardMaterial color="#7e848d" roughness={1} flatShading />
      </mesh>

      {/* Dört bir yana sur dizisi (kare plan) */}
      <Sur baslangic={[kx - 6, 0, kz - 6]} bitis={[kx + 6, 0, kz - 6]} yukseklik={3} />
      <Sur baslangic={[kx + 6, 0, kz - 6]} bitis={[kx + 6, 0, kz + 6]} yukseklik={3} />
      <Sur baslangic={[kx + 6, 0, kz + 6]} bitis={[kx - 6, 0, kz + 6]} yukseklik={3} />
      <Sur baslangic={[kx - 6, 0, kz + 6]} bitis={[kx - 6, 0, kz - 6]} yukseklik={2.2} />

      {/* Köşe burçları */}
      <Burc konum={[kx - 6, 3.9, kz - 6]} />
      <Burc konum={[kx + 6, 3.9, kz - 6]} />
      <Burc konum={[kx + 6, 3.9, kz + 6]} />
      <Burc konum={[kx - 6, 3.9, kz + 6]} yukseklik={4.5} yariCap={1.1} />

      {/* İç kale (bey konağı) — yıkık Bizans binası */}
      <group position={[kx + 1, 4, kz - 1]}>
        <mesh castShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[3.4, 2.4, 2.6]} />
          <meshStandardMaterial color="#a8adb6" roughness={1} flatShading />
        </mesh>
        <mesh castShadow position={[0.4, 2.7, 0]}>
          <boxGeometry args={[2.6, 0.7, 2]} />
          <meshStandardMaterial color="#8a8f98" roughness={1} flatShading />
        </mesh>
        {/* Yıkık duvar parçası */}
        <mesh castShadow position={[-2.4, 0.8, 0.6]} rotation={[0, 0.4, 0.12]}>
          <boxGeometry args={[0.6, 1.6, 1.4]} />
          <meshStandardMaterial color="#9aa0ab" roughness={1} flatShading />
        </mesh>
      </group>

      {/* Kapı boşluğu girişi (deniz tarafına bakar) */}
      <mesh position={[kx, 4.1, kz + 6]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2.2, 1.1]} />
        <meshStandardMaterial color="#3a2f27" roughness={1} />
      </mesh>
    </group>
  )
}

export function TarihiIskele({ mekan }) {
  const [kx, , kz] = mekan.konum
  const tahtalar = useMemo(() => {
    const t = []
    for (let i = 0; i < 12; i++) {
      t.push({ z: kz + 1 + i * 1.15, wobble: rnd(i * 7.7) * 0.06 })
    }
    return t
  }, [kz])

  return (
    <group>
      {/* Kıyı taş seti */}
      <mesh receiveShadow position={[kx, 0.25, kz - 0.5]}>
        <boxGeometry args={[6, 0.5, 3]} />
        <meshStandardMaterial color="#8a8f98" roughness={1} flatShading />
      </mesh>

      {/* İskele ayakları */}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <mesh key={`${r}-${c}`} castShadow position={[kx - 1.6 + c * 3.2, -0.6, kz + 2 + r * 4.5]}>
            <cylinderGeometry args={[0.16, 0.2, 2.6, 6]} />
            <meshStandardMaterial color="#4a3a2c" roughness={1} />
          </mesh>
        ))
      )}

      {/* Ahşap yürüyüş yolu */}
      {tahtalar.map((t, i) => (
        <mesh key={i} castShadow receiveShadow position={[kx, 0.72 + t.wobble, t.z]} rotation={[0, 0, t.wobble]}>
          <boxGeometry args={[3.6, 0.12, 1.0]} />
          <meshStandardMaterial color={i % 2 ? '#6b5238' : '#5f4a33'} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Bağlama direkleri (bollard) */}
      <mesh castShadow position={[kx - 1.4, 1.05, kz + 6]}>
        <cylinderGeometry args={[0.14, 0.18, 0.6, 8]} />
        <meshStandardMaterial color="#2f2a24" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[kx + 1.4, 1.05, kz + 10]}>
        <cylinderGeometry args={[0.14, 0.18, 0.6, 8]} />
        <meshStandardMaterial color="#2f2a24" roughness={0.9} />
      </mesh>

      {/* Küçük balıkçı teknesi */}
      <group position={[kx + 3.4, 0.1, kz + 8]} rotation={[0, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.5, 3.2]} />
          <meshStandardMaterial color="#2e6b7a" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.0, 0.18, 3.0]} />
          <meshStandardMaterial color="#c9d4e2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 2.2, 5]} />
          <meshStandardMaterial color="#5b4634" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
