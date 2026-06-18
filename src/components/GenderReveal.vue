<template>
  <div class="reveal-wrapper" :style="wrapperStyle">
    <!-- Halo / glow ring -->
    <div class="halo" />

    <!-- Main card -->
    <div
      class="reveal-card"
      :class="{ 'is-revealed': store.revealed }"
      @click="handleTap"
    >
      <p class="pre-label">Мы с нетерпением ждём</p>

      <!-- Большое сердечко в центре -->
      <div class="main-emoji">🩷</div>

      <!-- Надпись ДЕВОЧКА -->
      <h1 class="gender-text" :class="{ 'text-revealed': store.revealed }">
        ДЕВОЧКА
      </h1>

      <!-- Эмоциональный текст -->
      <p class="big-emotional-text">
        Наша маленькая принцесса,<br>
        наше чудо и самое большое счастье ✨
      </p>

      <!-- Ряд эмодзи -->
      <div class="emoji-row">
        <span 
          v-for="(e, i) in ['👼🏼','🍼','🎀','🌸','👑','🦋','💖','🧸']" 
          :key="i" 
          :style="{ animationDelay: `${i * 0.08}s` }"
        >
          {{ e }}
        </span>
      </div>

      <!-- Подсказка -->
      <p class="tap-hint" v-if="!store.revealed">
        Нажми на карточку, чтобы устроить праздник 🎆
      </p>
      <p class="tap-hint" v-else>
        Нажми ещё раз — будет новый салют! ✨
      </p>
    </div>

    <!-- Нижнее сообщение -->
    <div class="bottom-message" :class="{ 'visible': store.revealed }">
      <p>Мы так счастливы, что скоро обнимем тебя, наша девочка 💕</p>
      <p class="date-text">{{ currentDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGenderStore } from '../stores/gender'
import { useFireworks } from '../composables/useFireworks'

const props = defineProps<{ px: number; py: number }>()
const store = useGenderStore()
const { launchFireworks, launchMini } = useFireworks()

// Parallax
const wrapperStyle = computed(() => ({
  transform: `translate(${props.px * 6}px, ${props.py * 4}px)`
}))

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
})

async function handleTap(e: MouseEvent) {
  const wasRevealed = store.revealed
  store.setRevealed(true)
  store.triggerFireworks()

  if (!wasRevealed) {
    await launchFireworks()           // первый мощный салют
  } else {
    launchMini(e.clientX, e.clientY)  // мини-салют в точку нажатия
    launchFireworks()                 // ещё один большой
  }
}
</script>

<style scoped>
/* Wrapper */
.reveal-wrapper {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  will-change: transform;
  transition: transform 0.12s linear;
}

/* Halo */
.halo {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,182,193,0.6), transparent 70%);
  filter: blur(60px);
  opacity: 0.55;
  animation: halo-pulse 4s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes halo-pulse {
  0%, 100% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(1.18); opacity: 0.7; }
}

/* Glass Card */
.reveal-card {
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(28px) saturate(1.8);
  -webkit-backdrop-filter: blur(28px) saturate(1.8);
  border-radius: 32px;
  padding: 40px 32px 32px;
  width: min(92vw, 380px);
  text-align: center;
  cursor: pointer;
  border: 1.5px solid rgba(255,255,255,0.65);
  box-shadow:
    0 10px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.4) inset,
    0 25px 50px rgba(255, 105, 180, 0.15);
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.reveal-card:active {
  transform: scale(0.96);
}

/* Pre-label */
.pre-label {
  font-family: var(--font-body, 'Poppins', sans-serif);
  font-size: clamp(15px, 4vw, 17px);
  font-weight: 500;
  color: rgba(90, 50, 65, 0.75);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

/* Большое сердечко */
.main-emoji {
  font-size: clamp(88px, 25vw, 122px);
  line-height: 1;
  margin: 50px 0 18px;
  animation: emoji-bounce 2.8s ease-in-out infinite;
  filter: drop-shadow(0 10px 30px rgba(255, 105, 180, 0.45));
}

@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) scale(1) rotate(-4deg); }
  50% { transform: translateY(-12px) scale(1.06) rotate(4deg); }
}

/* Надпись ДЕВОЧКА — простой и чёткий текст */
.gender-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(46px, 12.5vw, 60px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #FF4A8F;                    /* Красивый ярко-розовый */
  text-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2),
    0 0 25px rgba(255, 74, 143, 0.5);
  
  margin-bottom: 14px;
  opacity: 1;
  transform: scale(1) translateY(0);
  animation: text-appear 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
}

@keyframes text-appear {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(25px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Пульсация после раскрытия */
.text-revealed {
  animation: glow-pulse 2.6s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    text-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.2),
      0 0 25px rgba(255, 74, 143, 0.5);
  }
  50% {
    text-shadow: 
      0 4px 18px rgba(0, 0, 0, 0.25),
      0 0 40px rgba(255, 74, 143, 0.8);
  }
}

/* Эмоциональный текст */
.big-emotional-text {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(17px, 4.8vw, 21px);
  font-style: italic;
  color: rgba(90, 40, 60, 0.85);
  line-height: 1.4;
  margin-bottom: 18px;
}

/* Emoji row */
.emoji-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: clamp(24px, 7vw, 30px);
  margin-bottom: 20px;
}
.emoji-row span {
  display: inline-block;
  animation: row-float 2.2s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}
@keyframes row-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Tap hint */
.tap-hint {
  font-family: var(--font-body, 'Poppins', sans-serif);
  font-size: clamp(13px, 3.6vw, 14.5px);
  color: rgba(90, 50, 65, 0.6);
  font-weight: 400;
  animation: hint-blink 2.6s ease-in-out infinite;
}
@keyframes hint-blink {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

/* Bottom message */
.bottom-message {
  text-align: center;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.9s ease 0.4s;
}
.bottom-message.visible {
  opacity: 1;
  transform: translateY(0);
}
.bottom-message p {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(16px, 4.6vw, 21px);
  font-style: italic;
  color: rgba(100, 45, 65, 0.85);
  text-shadow: 0 1px 4px rgba(255,255,255,0.6);
}
.date-text {
  font-family: var(--font-body, 'Poppins', sans-serif) !important;
  font-size: clamp(12px, 3.2vw, 13.5px) !important;
  margin-top: 6px;
  color: rgba(100, 50, 70, 0.5) !important;
}
</style>