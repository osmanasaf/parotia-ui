import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  srcDir: '.',
  
  css: ["assets/css/main.css"],
  
  vite: {
    plugins: [tailwindcss()]
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },

  app: {
    head: {
      title: 'Parotia - Duygu Bazlı Film Öneri Sistemi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ruh halinize göre mükemmel film ve dizi önerilerini keşfedin.' },
        { name: 'keywords', content: 'film, dizi, öneri, duygu, AI, yapay zeka' },
        { property: 'og:title', content: 'Parotia - Duygu Bazlı Film Öneri Sistemi' },
        { property: 'og:description', content: 'Ruh halinize göre mükemmel film ve dizi önerilerini keşfedin.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  modules: [],

  ssr: true,
  
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  }
})
