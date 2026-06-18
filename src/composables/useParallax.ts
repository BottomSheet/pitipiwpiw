import { ref, onMounted, onUnmounted } from 'vue'

interface ParallaxState {
  x: number  // -1 to 1
  y: number  // -1 to 1
}

export function useParallax() {
  const state = ref<ParallaxState>({ x: 0, y: 0 })
  const hasGyroscope = ref(false)
  const isPermissionGranted = ref(false)

  let rafId: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0

  // Smooth lerp update loop
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  function updateLoop() {
    currentX = lerp(currentX, targetX, 0.06)
    currentY = lerp(currentY, targetY, 0.06)
    state.value = { x: currentX, y: currentY }
    rafId = requestAnimationFrame(updateLoop)
  }

  // ===== GYROSCOPE (mobile) =====
  function handleOrientation(e: DeviceOrientationEvent) {
    if (e.gamma === null || e.beta === null) return
    // gamma: left/right tilt (-90 to 90)
    // beta: forward/backward tilt (-180 to 180)
    const maxGamma = 30
    const maxBeta = 30
    targetX = Math.max(-1, Math.min(1, e.gamma / maxGamma))
    targetY = Math.max(-1, Math.min(1, (e.beta - 45) / maxBeta))
  }

  async function requestGyroscope() {
    if (typeof DeviceOrientationEvent === 'undefined') return

    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const perm = await (DeviceOrientationEvent as any).requestPermission()
        if (perm === 'granted') {
          isPermissionGranted.value = true
          window.addEventListener('deviceorientation', handleOrientation, { passive: true })
          hasGyroscope.value = true
        }
      } catch {
        console.log('Gyroscope permission denied, using mouse fallback')
      }
    } else {
      // Android / non-iOS
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      hasGyroscope.value = true
      isPermissionGranted.value = true
    }
  }

  // ===== MOUSE FALLBACK (desktop) =====
  function handleMouseMove(e: MouseEvent) {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    targetX = (e.clientX - cx) / cx
    targetY = (e.clientY - cy) / cy
  }

  // ===== TOUCH FALLBACK (mobile without gyro) =====
  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 0) return
    const touch = e.touches[0]
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    targetX = (touch.clientX - cx) / cx
    targetY = (touch.clientY - cy) / cy
  }

  onMounted(() => {
    rafId = requestAnimationFrame(updateLoop)

    // Try gyroscope on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      // Check if gyroscope works without permission (Android)
      const testListener = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null) {
          hasGyroscope.value = true
          window.removeEventListener('deviceorientation', testListener)
          window.addEventListener('deviceorientation', handleOrientation, { passive: true })
        }
      }
      window.addEventListener('deviceorientation', testListener, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('deviceorientation', handleOrientation)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
  })

  return { state, hasGyroscope, isPermissionGranted, requestGyroscope }
}
