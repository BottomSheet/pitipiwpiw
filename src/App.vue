<template>
  <div class="app" :style="{ background: store.bgGradient, '--px': parallax.x, '--py': parallax.y }"></div>
  <div class="app" :style="{ background: store.bgGradient }">
    <!-- BG layers with parallax -->
    <BackgroundLayer :px="parallax.x" :py="parallax.y" />

    <!-- Floating emojis -->
    <FloatingEmojis />

    <!-- Center stage -->
    <main class="stage">
      <GenderReveal :px="parallax.x" :py="parallax.y" />
    </main>

    <!-- Controls -->
    <Controls @request-gyro="requestGyroscope" />

    <!-- Intro overlay -->
    <Transition name="fade-overlay">
      <div v-if="showIntro" class="intro-overlay" @click="dismissIntro">
        <div class="intro-content">
          <div class="intro-emoji">🎉</div>
          <h2 class="intro-title">Добро пожаловать!</h2>
          <p class="intro-sub">Мы хотим поделиться с тобой<br>самой важной новостью ✨</p>
          <button class="intro-btn" @click.stop="dismissIntro">
            Узнать кто будет!
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useGenderStore } from './stores/gender'
import { useParallax } from './composables/useParallax'
import { useFireworks } from './composables/useFireworks'
import BackgroundLayer from './components/BackgroundLayer.vue'
import FloatingEmojis from './components/FloatingEmojis.vue'
import GenderReveal from './components/GenderReveal.vue'
import Controls from './components/Controls.vue'

const store = useGenderStore()
const { state: parallaxState, requestGyroscope } = useParallax()
const { launchFireworks } = useFireworks()

// Reactive parallax proxy
const parallax = computed(() => parallaxState.value)

// Intro overlay
const showIntro = ref(true)

async function dismissIntro() {
  showIntro.value = false
  // Short delay then launch fireworks
  await new Promise(r => setTimeout(r, 600))
  store.setRevealed(true)
  launchFireworks()
}

onMounted(() => {
  // Start reveal after brief moment if user doesn't interact (auto-dismiss after 5s)
  setTimeout(() => {
    if (showIntro.value) dismissIntro()
  }, 5000)
})
</script>

<style>
/* ===== APP SHELL ===== */
.app {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  overflow: hidden;
  transition: background 1.2s ease;
}

/* ===== STAGE (center layout) ===== */
.stage {
  transform: rotateY(calc(var(--px) * 4deg)) rotateX(calc(var(--py) * -4deg));
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-bottom: 100px; /* space for controls */
  z-index: 20;
}

/* ===== INTRO OVERLAY ===== */
.intro-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 240, 248, 0.85);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: pointer;
}

.intro-content {
  position: relative;   /* добавить */
  overflow: hidden;     /* добавить */
  text-align: center;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 340px;
}

.intro-emoji {
  font-size: 72px;
  animation: intro-bounce 1.2s cubic-bezier(0.34,1.56,0.64,1) infinite alternate;
}

@keyframes intro-bounce {
  from { transform: scale(0.9) rotate(-5deg); }
  to   { transform: scale(1.1) rotate(5deg); }
}

.intro-title {
  font-family: var(--font-display);   /* ← Nunito */
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 800;
  background: linear-gradient(135deg, #FF8FAB, #FF4081);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-sub {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(14px, 4vw, 17px);
  color: rgba(90, 40, 60, 0.72);
  line-height: 1.6;
  font-weight: 400;
}

.intro-btn {
  margin-top: 8px;
  padding: 15px 36px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #FF8FAB, #FF4081);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(15px, 4.5vw, 17px);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(255, 64, 129, 0.35);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.01em;
}

.stage {
  transform: rotateY(calc(var(--px) * 4deg)) rotateX(calc(var(--py) * -4deg));
  transition: transform 0.15s ease-out;
}

.intro-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4px 14px rgba(255, 64, 129, 0.3);
}

/* ===== TRANSITIONS ===== */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-overlay-enter-from {
  opacity: 0;
  transform: scale(1.04);
}
.fade-overlay-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
