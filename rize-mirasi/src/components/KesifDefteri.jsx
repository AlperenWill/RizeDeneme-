import { X, CheckCircle2, Circle, MapPin } from 'lucide-react'
import { useOyunStore } from '../store/useOyunStore'

/**
 * KesifDefteri — Sağ üstten açılan yan menü.
 * Bölüm bölüm keşfedilen mekanları listeler; tıklanınca o bölüme geçilir.
 */
export default function KesifDefteri() {
  const acik = useOyunStore((s) => s.kesifDefteriAcik)
  const toggle = useOyunStore((s) => s.toggleDefter)
  const bolumler = useOyunStore((s) => s.bolumler)
  const mekanlar = useOyunStore((s) => s.mekanlar)
  const keşif = useOyunStore((s) => s.keşif)
  const setBolum = useOyunStore((s) => s.setBolum)
  const aktifBolumId = useOyunStore((s) => s.aktifBolumId)

  const toplamSayi = Object.values(keşif).filter(Boolean).length
  const yuzde = Math.round((toplamSayi / mekanlar.length) * 100)

  return (
    <>
      {/* Karartma */}
      <div
        onClick={toggle}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
          acik ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Yan panel */}
      <aside
        className={`glass fixed right-0 top-0 z-40 flex h-full w-[88%] max-w-sm flex-col rounded-l-3xl shadow-2xl transition-transform duration-300 ${
          acik ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!acik}
      >
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-lg font-extrabold text-white">📔 Keşif Defteri</h2>
            <p className="text-xs text-white/50">Rize Mirası — ilerlemen</p>
          </div>
          <button
            onClick={toggle}
            aria-label="Kapat"
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-vurgu"
          >
            <X size={18} />
          </button>
        </header>

        {/* Genel ilerleme */}
        <div className="px-4 pt-4">
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-white/60">
            <span>Genel İlerleme</span>
            <span>%{yuzde}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-vurgu transition-all duration-700"
              style={{ width: `${yuzde}%` }}
            />
          </div>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto px-4 py-4">
          {bolumler.map((b) => {
            const ms = mekanlar.filter((m) => m.bolumId === b.id)
            const done = ms.filter((m) => keşif[m.id]).length
            const aktif = b.id === aktifBolumId
            return (
              <section key={b.id} className="mb-5">
                <button
                  onClick={() => setBolum(b.id)}
                  className={`mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                    aktif ? 'bg-vurgu/20 ring-1 ring-vurgu' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-vurgu">
                      Bölüm {b.no}
                    </p>
                    <p className="text-sm font-bold text-white">{b.ad}</p>
                  </div>
                  <span className="text-xs font-bold text-white/60">
                    {done}/{ms.length}
                  </span>
                </button>

                <ul className="space-y-1.5 pl-1">
                  {ms.map((m) => {
                    const bulundu = !!keşif[m.id]
                    return (
                      <li key={m.id}>
                        <div
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                            bulundu ? 'bg-emerald-400/10' : 'bg-kart/60'
                          }`}
                        >
                          {bulundu ? (
                            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                          ) : (
                            <Circle size={18} className="shrink-0 text-white/25" />
                          )}
                          <div className="min-w-0">
                            <p
                              className={`truncate text-sm font-semibold ${
                                bulundu ? 'text-emerald-300' : 'text-white/70'
                              }`}
                            >
                              {m.ikon} {bulundu ? m.ad : '??????'}
                            </p>
                            <p className="truncate text-[11px] text-white/40">
                              {bulundu ? m.ozet : 'Henüz keşfedilmedi — kırmızı işareti bul!'}
                            </p>
                          </div>
                          {!aktif && (
                            <button
                              onClick={() => setBolum(b.id)}
                              className="ml-auto shrink-0 rounded-lg bg-white/10 p-1.5 text-white/60 hover:bg-vurgu hover:text-white"
                              aria-label="Bu bölüme git"
                            >
                              <MapPin size={14} />
                            </button>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        <footer className="border-t border-white/10 p-4 text-center text-[11px] text-white/40">
          TÜBİTAK Destekli Eğitim Projesi • Rize Mirası Keşif Simülasyonu
        </footer>
      </aside>
    </>
  )
}
