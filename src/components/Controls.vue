<template>
  <div class="controls">
    <!-- Replay fireworks button -->
    <button
      class="btn btn-replay"
      @click="replay"
      aria-label="Запустить салют снова"
    >
      🎆 Ещё раз!
    </button>

    <!-- Gyroscope permission (iOS) -->
    <button
      v-if="showGyroBtn"
      class="btn btn-gyro"
      @click="requestGyro"
      aria-label="Включить гироскоп"
    >
      📱 Гироскоп
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGenderStore } from '../stores/gender'
import { useFireworks } from '../composables/useFireworks'

const emit = defineEmits<{ (e: 'request-gyro'): void }>()
const store = useGenderStore()
const { launchFireworks } = useFireworks()

const showGyroBtn = ref(false)

onMounted(() => {
  // Show gyro button only on iOS 13+
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    showGyroBtn.value = true
  }
})

function replay() {
  store.setRevealed(true)
  launchFireworks()
}

function requestGyro() {
  emit('request-gyro')
  showGyroBtn.value = false
}
</script>

<style scoped>
.controls {
  position: fixed;
  bottom: max(24px, env(safe-area-inset-bottom, 24px));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 50;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-height: 46px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: var(--font-body, 'Poppins', sans-serif);
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease;
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  user-select: none;
}

.btn:active {
  transform: scale(0.93) !important;
}

.btn-replay {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.35);
  border: 1.5px solid rgba(255,255,255,0.55);
  color: #5a2d3f;
  font-size: clamp(13px, 3.5vw, 15px);
  padding: 11px 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08),
              0 4px 20px rgba(255,143,171,0.25);
}

/* Replay Button */
.btn-replay::before,
.intro-content::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.25) 100%);
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* Gyro Button */
.btn-gyro {
  background: rgba(255,255,255,0.25);
  border: 1.5px solid rgba(255,255,255,0.45);
  color: #4a3040;
  font-size: clamp(12px, 3vw, 14px);
  padding: 10px 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.07);
}
</style>