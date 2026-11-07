import { X, BookmarkPlus, Check } from 'lucide-react'
import { useOyunStore } from '../store/useOyunStore'

/**
 * BilgiKarti — Alt taraftan yukarı kayan, şeffaf (glass) bilgi paneli.
 * Sinematik modda görünür; "Deftere Kaydet" ile ilerleme işlenir.
 */
export default function BilgiKarti() {
  const acikKartId = useOyunStore((s) => s.acikKartId)
  const mekanlar = useOyunStore((s) => s.mekanlar)
  const keşif = useOyunStore((s) => s.keşif)
  const kapat = useOyunStore((s) => s.kapatKart)
  const kaydetVeKapat = useOyunStore((s) => s.kaydetVeKapat)

  const m = mekanlar.find((x) => x.id === acikKartId)
  if (!m) return null

  const bulundu = !!keşif[m.id]
  const c = m.icerik

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-5">
      <section className="glass pointer-events-auto w-full max-w-2xl animate-slideUp rounded-3xl p-5 shadow-2xl sm:p-6">
        {/* Başlık satırı */}
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">{m.ikon}</span>
            <div>
              <h3 className="text-lg font-extrabold text-white sm:text-xl">{c.baslik}</h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-vurgu">{c.dönem}</p>
            </div>
          </div>
          <button
            onClick={kapat}
            aria-label="Kapat"
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-vurgu"
          >
            <X size={18} />
          </button>
        </header>

        {/* Paragraflar */}
        <div className="thin-scroll max-h-[34vh] space-y-2.5 overflow-y-auto pr-1">
          {c.paragraflar.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/80">
              {p}
            </p>
          ))}
          <p className="rounded-2xl border border-vurgu/30 bg-vurgu/10 p-3 text-sm leading-relaxed text-white/90">
            {c.bilgiKutu}
          </p>
        </div>

        {/* Etiketler */}
        <div className="mt-3 flex flex-wrap gap-2">
          {c.etiketler.map((e) => (
            <span
              key={e}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70"
            >
              #{e}
            </span>
          ))}
        </div>

        {/* Aksiyonlar */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={kapat}
            className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20"
          >
            Keşfe Dön
          </button>
          <button
            onClick={kaydetVeKapat}
            disabled={bulundu}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors ${
              bulundu
                ? 'cursor-default bg-emerald-400/20 text-emerald-300'
                : 'bg-vurgu text-white hover:brightness-110'
            }`}
          >
            {bulundu ? <Check size={18} /> : <BookmarkPlus size={18} />}
            {bulundu ? 'Defterde Kayıtlı' : 'Keşif Defterine Kaydet'}
          </button>
        </div>
      </section>
    </div>
  )
}
