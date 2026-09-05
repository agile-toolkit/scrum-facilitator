import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // favicon.svg is excluded — it's corrupted pending a blocked brand
      // decision (#5); icons/icon.svg is a temporary placeholder mark
      // using the app's existing brand-500 green, not a new brand choice.
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Scrum Facilitator',
        short_name: 'Scrum Facilitator',
        description: 'Guided Scrum ceremonies — Sprint Planning, Daily Stand-up, Sprint Review, Retrospective',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/scrum-facilitator/',
        start_url: '/scrum-facilitator/',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/scrum-facilitator/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: '/scrum-facilitator/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
