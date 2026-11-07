import { Suspense, useMemo } from 'react'
import { Sky, Stars, Html } from '@react-three/drei'
import { useOyunStore, secAktifBolum, secAktifMekanlar } from '../store/useOyunStore'
import Terrain from './Terrain'
import Sea from './Sea'
import Hotspot from './Hotspot'
import LowPolyAgac from './LowPolyAgac'
import Tas from './Tas'
import Player from './Player'
import CinematicCamera from './CinematicCamera'
import { RizeKalesi, TarihiIskele } from './Bolum1Mekanlari'
import { CayBitkisi, TasKopru } from './Bolum2Mekanlari'
import { Zilkale, DereKenari } from './Bolum3Mekanlari'

/** Mekan id → 3D bileşen eşlemesi */
const MEKAN_BILESSEN = {
  'rize-kalesi': RizeKalesi,
  'tarihi-iskele': TarihiIskele,
  'cay-bitkisi': CayBitkisi,
  'tas-kopru': TasKopru,
  'zilkale-duvarlari': Zilkale,
  'dere-kenari': DereKenari,
}

// Bölüme göre dekor yerleşimi (ağaç/taş) — deterministik
function dekorUret(bolumId) {
  const agclar = []
  const taslar = []
  let seed = bolumId === 'bolum1' ? 11 : bolumId === 'bolum2' ? 47 : 83
  const r = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const adetA = bolumId === 'bolum2' ? 10 : 16
  for (let i = 0; i < adetA; i++) {
    const x = -32 + r() * 64
    const z = -30 + r() * 50
    agclar.push([x, 0, z])
  }
  for (let i = 0; i < 10; i++) {
    const x = -30 + r() * 60
    const z = -28 + r() * 48
    taslar.push({ p: [x, 0, z], s: 0.4 + r() * 0.9 })
  }
  return { agclar, taslar }
}

export default function Sahne() {
  const bolum = useOyunStore(secAktifBolum)
  const mekanlar = useOyunStore(secAktifMekanlar)
  const { agclar, taslar } = useMemo(() => dekorUret(bolum.id), [bolum.id])

  // Sis ve arka plan renkleri JSON'dan
  const sisRengi = bolum.ortam.sis
  const zeminRenk = bolum.id === 'bolum1' ? '#6f7d86' : bolum.id === 'bolum2' ? '#3e7a44' : '#4c5a49'
  const denizKenari = bolum.id === 'bolum1' ? 22 : 999

  return (
    <>
      {/* ---- Atmosfer ---- */}
      <fog attach="fog" args={[sisRengi, 25, bolum.ortam.sisUzakligi]} />
      <color attach="background" args={[bolum.id === 'bolum3' ? sisRengi : '#bfe3f2']} />
      {bolum.id !== 'bolum3' && (
        <Sky sunPosition={[40, 25, 60]} turbidity={bolum.id === 'bolum2' ? 6 : 4} rayleigh={1.2} />
      )}
      {bolum.id === 'bolum3' && <Stars radius={80} depth={30} count={400} factor={2} fade speed={0.4} />}

      {/* ---- Işıklar ---- */}
      <ambientLight intensity={bolum.id === 'bolum3' ? 0.55 : 0.7} color={bolum.ortam.gunes} />
      <hemisphereLight args={[sisRengi, '#2f4a2f', 0.5]} />
      <directionalLight
        position={[30, 40, 20]}
        intensity={1.35}
        color={bolum.ortam.gunes}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-far={120}
      />

      {/* ---- Zemin & deniz ---- */}
      <Terrain renk={zeminRenk} denizKenari={denizKenari} yukseklik={bolum.id === 'bolum3' ? 1.6 : 2.4} />
      {bolum.id === 'bolum1' && <Sea konum={[0, -0.12, 46]} />}

      {/* ---- Dekor ---- */}
      {agclar.map((p, i) => (
        <LowPolyAgac key={`${bolum.id}-a${i}`} position={p} olcek={0.8 + ((i * 7) % 10) / 12} />
      ))}
      {taslar.map((t, i) => (
        <Tas key={`${bolum.id}-t${i}`} position={t.p} olcek={t.s} donme={i * 0.7} />
      ))}

      {/* ---- Etkileşimli mekanlar + hotspotlar ---- */}
      <Suspense
        fallback={
          <Html center>
            <div className="text-vurgu font-bold">Sahne yükleniyor…</div>
          </Html>
        }
      >
        {mekanlar.map((m) => {
          const Bilesen = MEKAN_BILESSEN[m.id]
          if (!Bilesen) return null
          return (
            <group key={m.id}>
              <Bilesen mekan={m} />
              <Hotspot konum={m.konum} yukseklik={m.id === 'zilkale-duvarlari' ? 14 : m.id === 'rize-kalesi' ? 12 : 3.2} mekanId={m.id} />
            </group>
          )
        })}
      </Suspense>

      {/* ---- Oyuncu ve sinematik kamera ---- */}
      <Player />
      <CinematicCamera />
    </>
  )
}
