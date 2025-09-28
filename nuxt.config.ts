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
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      titleTemplate: (chunk) => chunk ? `${chunk} | movAi` : 'movAi - Emotion-Based Movie Recommendation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ruh halinize göre film ve dizi önerileri keşfedin.' },
        { name: 'keywords', content: 'film, dizi, öneri, duygu, yapay zeka, AI' },
        { property: 'og:title', content: 'movAi - Duygu Bazlı Film Öneri Sistemi' },
        { property: 'og:description', content: 'Ruh halinize göre film ve dizi önerileri keşfedin.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'movAi - Emotion-Based Movie Recommendation' },
        { name: 'twitter:description', content: 'Discover perfect movie and TV recommendations based on your mood.' },
        { name: 'twitter:image', content: '/og-image.svg' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    // Vercel Analytics: yalnızca prod/ci ortamlarında yükle
    ...(process.env.VERCEL_ANALYTICS === '1' ? ['@vercel/analytics/nuxt'] as const : [])
  ],

  components: true,

  ssr: true,
  
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    }
  }
})
