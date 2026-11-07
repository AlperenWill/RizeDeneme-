import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useOyunStore } from '../store/useOyunStore'

/**
 * OneInput — Tek giriş soyutlaması:
 *  - Masaüstü: WASD / Ok tuşları + Mouse (PointerLockControls)
 *  - Mobil: Sanal joystick (Joystick.jsx) + dokunmatik sürükleme ile bakış
 * Hareket daima kameranın bakış yönüne göredir (birinci şahıs).
 */

const HIZ = 6 // m/sn
const YUKSEKLIK = 1.7 // göz hizası
const ALAN = 34 // harita sınır karesi (+/-)

export const girdiDurumu = {
  ileri: false,
  geri: false,
  sol: false,
  sag: false,
  // Mobil joystick vektörü (-1..1)
  jc: 0,
  js: 0,
}

export function setJoystickVec(x, y) {
  girdiDurumu.jc = x
  girdiDurumu.js = y
}

// Mobilde parmakla bakış için sürükleme durumu
export const dokunmaBakis = { dx: 0, dy: 0, aktif: false }

const _yeni = new THREE.Vector3()
const _ileri = new THREE.Vector3()
const _sag = new THREE.Vector3()

export default function Player() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const sinematikMod = useOyunStore((s) => s.sinematikMod)
  const yakinMekanId = useOyunStore((s) => s.yakinMekanId)
  const mekanlar = useOyunStore((s) => s.mekanlar)
  const setYakinMekan = useOyunStore((s) => s.setYakinMekan)
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const surukle = useRef({ var: false, x: 0, y: 0 })

  // ---- Klavye ----
  useEffect(() => {
    const harita = {
      KeyW: 'ileri',
      ArrowUp: 'ileri',
      KeyS: 'geri',
      ArrowDown: 'geri',
      KeyA: 'sol',
      ArrowLeft: 'sol',
      KeyD: 'sag',
      ArrowRight: 'sag',
    }
    const down = (e) => {
      const k = harita[e.code]
      if (k) {
        girdiDurumu[k] = true
        e.preventDefault()
      }
    }
    const up = (e) => {
      const k = harita[e.code]
      if (k) girdiDurumu[k] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // ---- Fare ile bakış (basılı tutarak veya pointer lock) ----
  useEffect(() => {
    const dom = gl.domElement
    let locked = false

    const onLockChange = () => {
      locked = document.pointerLockElement === dom
    }
    const onClick = () => {
      // Sinematik modda kilitleme; mobil dokunuşlarda denemeyi sessizce atla
      if (!useOyunStore.getState().sinematikMod && !surukle.current.var && dom.requestPointerLock) {
        const p = dom.requestPointerLock({ unadjustedMovement: true })
        if (p && p.catch) p.catch(() => {})
      }
    }
    const onMouseMove = (e) => {
      if (locked && !useOyunStore.getState().sinematikMod) {
        euler.setFromQuaternion(camera.quaternion)
        euler.y -= e.movementX * 0.0022
        euler.x -= e.movementY * 0.0022
        euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, euler.x))
        camera.quaternion.setFromEuler(euler)
      }
    }

    // Mobil: tek parmak sürükleme = bakış
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        surukle.current = { var: true, x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (surukle.current.var && !useOyunStore.getState().sinematikMod) {
        const dx = t.clientX - surukle.current.x
        const dy = t.clientY - surukle.current.y
        surukle.current.x = t.clientX
        surukle.current.y = t.clientY
        euler.setFromQuaternion(camera.quaternion)
        euler.y -= dx * 0.004
        euler.x -= dy * 0.004
        euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, euler.x))
        camera.quaternion.setFromEuler(euler)
      }
    }
    const onTouchEnd = () => (surukle.current.var = false)

    document.addEventListener('pointerlockchange', onLockChange)
    dom.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMouseMove)
    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    dom.addEventListener('touchmove', onTouchMove, { passive: true })
    dom.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('pointerlockchange', onLockChange)
      dom.removeEventListener('click', onClick)
      document.removeEventListener('mousemove', onMouseMove)
      dom.removeEventListener('touchstart', onTouchStart)
      dom.removeEventListener('touchmove', onTouchMove)
      dom.removeEventListener('touchend', onTouchEnd)
    }
  }, [camera, gl])

  // ---- Her kare: hareket + sınır + yakınlık kontrolü ----
  useFrame((_, dt) => {
    if (sinematikMod) return
    const d = Math.min(dt, 0.05)

    let f = (girdiDurumu.ileri ? 1 : 0) - (girdiDurumu.geri ? 1 : 0) + -girdiDurumu.js
    let s = (girdiDurumu.sag ? 1 : 0) - (girdiDurumu.sol ? 1 : 0) + girdiDurumu.jc
    f = THREE.MathUtils.clamp(f, -1, 1)
    s = THREE.MathUtils.clamp(s, -1, 1)

    if (f !== 0 || s !== 0) {
      camera.getWorldDirection(_ileri)
      _ileri.y = 0
      _ileri.normalize()
      _sag.crossVectors(_ileri, camera.up).normalize()
      _yeni.set(0, 0, 0).addScaledVector(_ileri, f).addScaledVector(_sag, s)
      if (_yeni.lengthSq() > 0) {
        _yeni.normalize().multiplyScalar(HIZ * d)
        camera.position.add(_yeni)
      }
    }

    // Harita sınırları ve zemin yüksekliği
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -ALAN, ALAN)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -ALAN, ALAN)
    camera.position.y = YUKSEKLIK

    // Yakınlık (🔍 İncele) — basit kare mesafe, raycast yerine ucuz kontrol
    let enYakin = null
    let enYakinMesafe = Infinity
    for (const m of mekanlar) {
      if (m.bolumId !== useOyunStore.getState().aktifBolumId) continue
      const dx = camera.position.x - m.konum[0]
      const dz = camera.position.z - m.konum[2]
      const mesafe = Math.hypot(dx, dz)
      if (mesafe < m.incelemeMesafesi && mesafe < enYakinMesafe) {
        enYakinMesafe = mesafe
        enYakin = m.id
      }
    }
    if (enYakin !== yakinMekanId) setYakinMekan(enYakin)
  })

  return null
}
