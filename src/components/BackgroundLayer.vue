<template>
  <!-- Layer 0: base gradient (static) -->
  <div class="bg-base" :style="{ background: store.bgGradient }" />

  <!-- Layer 1: glow orbs (slow parallax) -->
  <div class="bg-layer layer-1" :style="layer1Style">
    <div class="orb orb-1" :class="store.isGirl ? 'orb-pink' : 'orb-blue'" />
    <div class="orb orb-2" :class="store.isGirl ? 'orb-rose' : 'orb-cyan'" />
    <div class="orb orb-3" :class="store.isGirl ? 'orb-lilac' : 'orb-sky'" />
  </div>

  <!-- Layer 2: sparkles / stars (medium parallax) -->
  <div class="bg-layer layer-2" :style="layer2Style">
    <span
      v-for="s in sparkles"
      :key="s.id"
      class="sparkle"
      :style="s.style"
    >✦</span>
  </div>

  <!-- Layer 3: clouds / shapes (fast parallax) -->
  <div class="bg-layer layer-3" :style="layer3Style">
    <span
      v-for="c in clouds"
      :key="c.id"
      class="cloud"
      :style="c.style"
    >{{ c.emoji }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGenderStore } from '../stores/gender'

const props = defineProps<{ px: number; py: number }>()
const store = useGenderStore()

// Parallax transform helpers
function parallaxStyle(factorX: number, factorY: number) {
  return {
    transform: `translate(${props.px * factorX}px, ${props.py * factorY}px)`
  }
}

const layer1Style = computed(() => parallaxStyle(-12, -8))
const layer2Style = computed(() => parallaxStyle(-20, -14))
const layer3Style = computed(() => parallaxStyle(-30, -20))

// Sparkles
const sparkles = ref(
  Array.from({ length: 24 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 12 + 8}px`,
      opacity: Math.random() * 0.5 + 0.2,
      animationDelay: `${Math.random() * 4}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      color: Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,215,0,0.6)',
    }
  }))
)

// Floating clouds / heart shapes
const cloudEmojisGirl = ['💗', '🌸', '☁️', '💞', '🌺', '💫', '⭐', '🌙']
const cloudEmojisBoy = ['💙', '⭐', '☁️', '💫', '🌊', '🌙', '❄️', '🔵']
const clouds = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: (i % 2 === 0 ? cloudEmojisGirl : cloudEmojisBoy)[Math.floor(Math.random() * 8)],
    style: {
      left: `${Math.random() * 95}%`,
      top: `${Math.random() * 90}%`,
      fontSize: `${Math.random() * 18 + 12}px`,
      opacity: Math.random() * 0.3 + 0.1,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${Math.random() * 6 + 6}s`,
    }
  }))
)
</script>

<style scoped>
/* Base */
.bg-base {
  position: fixed;
  inset: 0;
  transition: background 1.2s ease;
  z-index: 0;
}

/* Layers */
.bg-layer {
  position: fixed;
  inset: -60px;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.1s linear;
  z-index: 1;
}

/* Glow orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.45;
}
.orb-1 { width: 55vw; height: 55vw; top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; bottom: -5%; right: -5%; }
.orb-3 { width: 35vw; height: 35vw; top: 35%; left: 30%; }

.orb-pink  { background: radial-gradient(circle, #FFB6C1, #FF69B4); }
.orb-rose  { background: radial-gradient(circle, #FFD6E0, #FF8FAB); }
.orb-lilac { background: radial-gradient(circle, #E8C5E5, #D4A0D0); }
.orb-blue  { background: radial-gradient(circle, #A5D6FF, #5BB8F5); }
.orb-cyan  { background: radial-gradient(circle, #D0EEFF, #87CEEB); }
.orb-sky   { background: radial-gradient(circle, #B0E0FF, #6495ED); }

/* Sparkles */
.sparkle {
  position: absolute;
  animation: sparkle-pulse var(--dur, 3s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  user-select: none;
}
@keyframes sparkle-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
  50% { transform: scale(1.4) rotate(20deg); opacity: 0.7; }
}

/* Clouds */
.cloud {
  position: absolute;
  animation: float-cloud var(--dur, 8s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  user-select: none;
}
@keyframes float-cloud {
  0%, 100% { transform: translateY(0px) rotate(-3deg); }
  50% { transform: translateY(-18px) rotate(3deg); }
}
</style>
