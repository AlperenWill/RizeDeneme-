import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import veri from '../data/locations.json'

/**
 * Global oyun durumu — Zustand
 * - Keşif Defteri (progress) localStorage'a yazılır (persist middleware)
 * - Aktif bölüm, etkileşim (yakınlık), sinematik mod ve ses durumu
 */

const BOLUM_LISTESI = veri.bolumler
const MEKAN_LISTESI = veri.mekanlar

const bosIlerleme = () => {
  const map = {}
  MEKAN_LISTESI.forEach((m) => {
    map[m.id] = false
  })
  return map
}

export const useOyunStore = create(
  persist(
    (set, get) => ({
      // ---- Statik veri ----
      bolumler: BOLUM_LISTESI,
      mekanlar: MEKAN_LISTESI,

      // ---- Oyun durumu ----
      aktifBolumId: 'bolum1',
      kesifDefteriAcik: false,
      sertifikaEkrani: false,
      sinematikMod: false, // Kamera otomatik en iyi açıya döner
      acikKartId: null, // Bilgi kartında gösterilen mekan
      yakinMekanId: null, // İnceleme mesafesindeki mekan (🔍 butonu)
      sesKapali: false,
      joystickVarsin: false, // Mobil sanal joystick aktif mi

      // ---- Keşif ilerlemesi (localStorage) ----
      keşif: bosIlerleme(),
      sonRozet: null, // Yeni kazanılan rozet animasyonu için

      // ---- Aksiyonlar ----
      setBolum: (id) => {
        const b = BOLUM_LISTESI.find((x) => x.id === id)
        if (!b) return
        set({
          aktifBolumId: id,
          sinematikMod: false,
          acikKartId: null,
          yakinMekanId: null,
        })
      },

      setYakinMekan: (id) => {
        if (get().yakinMekanId === id) return
        set({ yakinMekanId: id })
      },

      setJoystickVarsin: (v) => set({ joystickVarsin: v }),

      toggleDefter: () => set((s) => ({ kesifDefteriAcik: !s.kesifDefteriAcik })),

      toggleSes: () => set((s) => ({ sesKapali: !s.sesKapali })),

      /** Mekanı incele: sinematik moda geç + bilgi kartını aç */
      incele: (mekanId) => {
        const m = MEKAN_LISTESI.find((x) => x.id === mekanId)
        if (!m) return
        set({ sinematikMod: true, acikKartId: mekanId, kesifDefteriAcik: false })
      },

      /** Sinematik moddan çık, serbest geziye dön */
      kapatKart: () => set({ sinematikMod: false, acikKartId: null }),

      /** Karttaki "Deftere Kaydet" aksiyonu */
      kaydetVeKapat: () => {
        const { acikKartId, keşif } = get()
        if (!acikKartId || keşif[acikKartId]) {
          set({ sinematikMod: false, acikKartId: null })
          return
        }
        const yeni = { ...keşif, [acikKartId]: true }
        const m = MEKAN_LISTESI.find((x) => x.id === acikKartId)
        const toplam = MEKAN_LISTESI.length
        const sayi = Object.values(yeni).filter(Boolean).length
        set({
          keşif: yeni,
          sonRozet: m ? { id: m.id, ad: m.ad, ikon: m.ikon } : null,
          sinematikMod: false,
          acikKartId: null,
          sertifikaEkrani: sayi >= toplam,
        })
        // Rozet animasyonu kendini temizlesin
        setTimeout(() => set({ sonRozet: null }), 2600)
      },

      /** Tüm ilerlemeyi sıfırla (geliştirici/test için) */
      sifirla: () =>
        set({
          keşif: bosIlerleme(),
          sertifikaEkrani: false,
          sinematikMod: false,
          acikKartId: null,
          sonRozet: null,
        }),

      // ---- Yardımcı hesaplar ----
      istatistik: () => {
        const k = get().keşif
        const sayi = Object.values(k).filter(Boolean).length
        return {
          keşfedilen: sayi,
          toplam: MEKAN_LISTESI.length,
          yuzde: Math.round((sayi / MEKAN_LISTESI.length) * 100),
        }
      },

      bolumIstatistik: (bolumId) => {
        const ms = MEKAN_LISTESI.filter((m) => m.bolumId === bolumId)
        const k = get().keşif
        const done = ms.filter((m) => k[m.id]).length
        return { done, total: ms.length, tamam: done === ms.length && ms.length > 0 }
      },
    }),
    {
      name: 'rize-mirasi-defter',
      partialize: (s) => ({ keşif: s.keşif, aktifBolumId: s.aktifBolumId }),
    }
  )
)

// Seçiciler (render optimizasyonu için)
export const secAktifBolum = (s) =>
  s.bolumler.find((b) => b.id === s.aktifBolumId) ?? s.bolumler[0]
export const secAktifMekanlar = (s) =>
  s.mekanlar.filter((m) => m.bolumId === s.aktifBolumId)
export const secMekan = (id) => (s) => s.mekanlar.find((m) => m.id === id)
