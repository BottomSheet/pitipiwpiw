import confetti from 'canvas-confetti'
import { useGenderStore } from '../stores/gender'

export function useFireworks() {
  const store = useGenderStore()

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  // 🎆 Grand launch fireworks
  async function launchFireworks() {
    const colors = store.confettiColors
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      // Left cannon
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.4),
        gravity: 0.8,
        drift: 0.5,
      })
      // Right cannon
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.4),
        gravity: 0.8,
        drift: -0.5,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }

    // Initial burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      gravity: 0.6,
      startVelocity: 45,
    })

    frame()

    // Staggered bursts
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 80, origin: { x: 0.3, y: 0.4 }, colors, gravity: 0.7 })
    }, 400)
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 80, origin: { x: 0.7, y: 0.4 }, colors, gravity: 0.7 })
    }, 700)
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 70, origin: { x: 0.5, y: 0.3 }, colors, gravity: 0.6 })
    }, 1100)
  }

  // 💫 Gentle mini burst (tap)
  function launchMini(x: number, y: number) {
    const colors = store.confettiColors
    const originX = x / window.innerWidth
    const originY = y / window.innerHeight

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { x: originX, y: originY },
      colors,
      shapes: ['circle'],
      scalar: randomInRange(0.6, 1.0),
      gravity: 0.9,
      startVelocity: 30,
    })
  }

  // ⭐ Star shower
  function launchStars() {
    const colors = store.confettiColors
    const defaults = { spread: 360, ticks: 60, gravity: 0, decay: 0.96, startVelocity: 20 }
    function shoot() {
      confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['circle'], colors })
      confetti({ ...defaults, particleCount: 15, scalar: 2, shapes: ['circle'], colors: ['#FFFFFF'] })
    }
    setTimeout(shoot, 0)
    setTimeout(shoot, 200)
    setTimeout(shoot, 400)
  }

  return { launchFireworks, launchMini, launchStars }
}
