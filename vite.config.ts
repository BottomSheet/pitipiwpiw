import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/pitipiwpiw/',   // ← ОБЯЗАТЕЛЬНО должно быть именно так

  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Гендер паття💕',
        short_name: 'Гендер паття',
        description: 'Узнай пол ребёнка!',
        theme_color: '#FFB6C1',
        background_color: '#fff0f5',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})