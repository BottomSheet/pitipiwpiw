import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGenderStore = defineStore('gender', () => {
  const revealed = ref(false)
  const fireworksCount = ref(0)

  const label = computed(() => 'ДЕВОЧКА')
  const emoji = computed(() => '🩷')
  const bgGradient = computed(() =>
    'linear-gradient(135deg, #FFD6E7 0%, #FFC2D4 30%, #FFB6C1 60%, #E8C5E5 100%)'
  )
  const glowColor = computed(() => 'rgba(255, 143, 171, 0.5)')
  const accentColor = computed(() => '#FF8FAB')
  const confettiColors = computed(() =>
    ['#FFB6C1', '#FF8FAB', '#FFD6E0', '#FF69B4', '#FFFFFF', '#FFE4E1', '#FF1493']
  )
  const floatingEmojis = computed(() =>
    ['🩷', '💕', '🎀', '🌸', '✨', '💗', '🌺', '👼🏼', '🍼', '🧸', '👑', '🦋', '💖']
  )

  function setRevealed(val: boolean) {
    revealed.value = val
  }
  function triggerFireworks() {
    fireworksCount.value++
  }

  return {
    revealed, fireworksCount,
    label, emoji, bgGradient, glowColor, accentColor,
    confettiColors, floatingEmojis,
    setRevealed, triggerFireworks
  }
})