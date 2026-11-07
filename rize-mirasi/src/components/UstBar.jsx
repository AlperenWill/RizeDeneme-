import { BookMarked } from 'lucide-react'
import { useOyunStore } from '../store/useOyunStore'

/**
 * UstBar — Üst bilgi çubuğu: bölüm adı, ilerleme ve Keşif Defteri butonu.
 */
export default function UstBar() {
  const bolum = useOyunStore((s) => s.bolumler.find((b) => b.id === s.aktifBolumId))
  const keşif = useOyunStore((s) => s.keşif)
  const mekanlar = useOyunStore((s) => s.mekanlar)
  const toggleDefter = useOyunStore((s) => s.toggleDefter)
  const kesifDefteriAcik = useOyunStore((s) => s.kesifDefteriAcik)

  const toplam = mekanlar.length
  const sayi = Object.values(keşif).filter(Boolean).length

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-4">
      {/* Bölüm rozeti */}
      <div className="glass pointer-events-auto rounded-2xl px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-breathe rounded-full bg-vurgu" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Bölüm {bolum?.no}
            </p>
            <h1 className="text-sm font-bold text-white sm:text-base">{bolum?.ad}</h1>
          </div>
        </div>
        <p className="mt-1 hidden max-w-xs text-xs leading-snug text-white/60 sm:block">
          {bolum?.ozet}
        </p>
      </div>

      {/* İlerleme + Defter */}
      <div className="glass pointer-events-auto flex items-center gap-3 rounded-2xl px-3 py-2 shadow-lg">
        <div className="hidden text-right sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Keşif</p>
          <p className="text-sm font-extrabold text-white">
            {sayi}
            <span className="text-white/40">/{toplam}</span>
          </p>
        </div>
        <div className="relative h-9 w-9">
          <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#ffffff14" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#F04448"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${(sayi / toplam) * 94.2} 94.2`}
              className="transition-all duration-700"
            />
          </svg>
        </div>
        <button
          onClick={toggleDefter}
          aria-label="Keşif Defteri"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
            kesifDefteriAcik ? 'bg-vurgu text-white' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <BookMarked size={18} className={kesifDefteriAcik ? '' : 'text-vurgu'} />
          <span className="hidden md:inline">Keşif Defteri</span>
        </button>
      </div>
    </div>
  )
}
