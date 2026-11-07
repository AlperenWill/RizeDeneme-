import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useOyunStore } from '../store/useOyunStore'

/**
 * CinematicCamera — "🔍 İncele" tetiklendiğinde kamerayı yumuşak bir
 * spline/lerp ile mekanın en iyi açıya taşır. Serbest modda beklemede.
 */
const _hedefP = new THREE.Vector3()
const _hedefB = new THREE.Vector3()

export default function CinematicCamera() {
  const camera = useThree((s) => s.camera)
  const sinematikMod = useOyunStore((s) => s.sinematikMod)
  const acikKartId = useOyunStore((s) => s.acikKartId)
  const mekanlar = useOyunStore((s) => s.mekanlar)
  const lerpT = useRef(0)
  const baslangic = useRef({ p: new THREE.Vector3(), q: new THREE.Quaternion() })

  useEffect(() => {
    if (sinematikMod && acikKartId) {
      lerpT.current = 0
      baslangic.current.p.copy(camera.position)
      baslangic.current.q.copy(camera.quaternion)
      // Pointer lock varsa çık (UI tıklamaları serbest olsun)
      if (document.pointerLockElement) document.exitPointerLock()
    }
  }, [sinematikMod, acikKartId, camera])

  useFrame((_, dt) => {
    if (!sinematikMod || !acikKartId) return
    const m = mekanlar.find((x) => x.id === acikKartId)
    if (!m || !m.kameraAcisi) return

    // Yumuşak ease-in-out
    lerpT.current = Math.min(1, lerpT.current + dt * 0.9)
    const t = lerpT.current
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    _hedefP.fromArray(m.kameraAcisi.konum)
    camera.position.lerpVectors(baslangic.current.p, _hedefP, e)

    // Bakış yönü: hedefe doğru quaternion slerp
    const tmp = new THREE.Object3D()
    tmp.position.copy(camera.position)
    _hedefB.fromArray(m.kameraAcisi.bakis)
    tmp.lookAt(_hedefB)
    camera.quaternion.slerpQuaternions(baslangic.current.q, tmp.quaternion, Math.min(1, e * 1.4))
  })

  return null
}
