<template>
  <div class="floating-container" ref="containerRef">
    <div
      v-for="item in items"
      :key="item.id"
      class="floating-emoji"
      :class="{ 'is-caught': item.caught, 'is-dragging': item.id === draggingId }"
      :style="getStyle(item)"
      @pointerdown.prevent="startDrag($event, item)"
      @click="onTap($event, item)"
    >
      {{ item.emoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useGenderStore } from '../stores/gender'
import { useFireworks } from '../composables/useFireworks'

const store = useGenderStore()
const { launchMini } = useFireworks()
const containerRef = ref<HTMLElement | null>(null)

interface EmojiItem {
  id: number
  emoji: string
  x: number
  y: number
  size: number
  speed: number
  phase: number
  amplitude: number
  caught: boolean
  vx: number
  vy: number
}

const items = ref<EmojiItem[]>([])
const draggingId = ref<number | null>(null)
let dragOffsetX = 0
let dragOffsetY = 0
let animFrame: number

function createItems() {
  const emojis = store.floatingEmojis
  items.value = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    x: Math.random() * 90 + 5,       // % of viewport
    y: Math.random() * 80 + 5,
    size: Math.random() * 22 + 20,   // px
    speed: Math.random() * 0.4 + 0.2,
    phase: Math.random() * Math.PI * 2,
    amplitude: Math.random() * 12 + 6,
    caught: false,
    vx: 0,
    vy: 0,
  }))
}

// Physics loop
let t = 0
function animate() {
  t += 0.016
  items.value.forEach(item => {
    if (item.id === draggingId.value) return
    if (item.caught) {
      // Drift back to natural position slowly
      item.vy += 0.05
      item.y += item.vy * 0.5
      if (item.y > 105) {
        item.y = -5
        item.x = Math.random() * 90 + 5
        item.vy = 0
        item.caught = false
      }
    } else {
      // Float animation
      item.y -= item.speed * 0.04
      item.x += Math.sin(t * item.speed + item.phase) * 0.05
      if (item.y < -8) {
        item.y = 108
        item.x = Math.random() * 90 + 5
      }
    }
  })
  animFrame = requestAnimationFrame(animate)
}

// Style for each emoji
function getStyle(item: EmojiItem) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: `${item.size}px`,
    opacity: item.caught ? '0.4' : '0.75',
    transform: `translate(-50%, -50%) rotate(${Math.sin(item.phase + item.x * 0.05) * 15}deg)`,
    zIndex: item.id === draggingId.value ? 100 : 10,
    cursor: 'grab',
  }
}

// Drag logic
function startDrag(e: PointerEvent, item: EmojiItem) {
  draggingId.value = item.id
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  dragOffsetX = (e.clientX - rect.left) - (item.x / 100) * rect.width
  dragOffsetY = (e.clientY - rect.top) - (item.y / 100) * rect.height

  function onMove(ev: PointerEvent) {
    const r = containerRef.value?.getBoundingClientRect()
    if (!r) return
    item.x = ((ev.clientX - r.left - dragOffsetX) / r.width) * 100
    item.y = ((ev.clientY - r.top - dragOffsetY) / r.height) * 100
    item.x = Math.max(0, Math.min(100, item.x))
    item.y = Math.max(0, Math.min(100, item.y))
  }

  function onUp(ev: PointerEvent) {
    draggingId.value = null
    item.caught = true
    item.vy = 0
    launchMini(ev.clientX, ev.clientY)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)
}

function onTap(e: MouseEvent, item: EmojiItem) {
  launchMini(e.clientX, e.clientY)
  item.caught = false
  item.vy = -2
}

onMounted(() => {
  createItems()
  animFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})

watch(() => store.gender, () => {
  createItems()
})
</script>

<style scoped>
.floating-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.floating-emoji {
  position: absolute;
  pointer-events: all;
  user-select: none;
  will-change: transform, left, top;
  transition: opacity 0.4s ease;
  -webkit-text-stroke: 0;
  line-height: 1;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
}

.floating-emoji:active {
  cursor: grabbing;
  transform: scale(1.3) !important;
}

.floating-emoji.is-caught {
  filter: drop-shadow(0 4px 12px rgba(255,130,170,0.4)) grayscale(0.3);
}
</style>
