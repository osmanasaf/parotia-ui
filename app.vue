<template>
  <div>
    <NuxtPage />
    <ClientOnly>
      <AuthModal />
    </ClientOnly>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { AuthModal } from '~/components/ui'
import AppFooter from '~/components/layout/AppFooter.vue'

const { getCurrentUser } = useAuth()

useHead({
  htmlAttrs: {
    lang: 'tr'
  },
  link: [
    { rel: 'canonical', href: 'https://movai.app' }
  ]
})

useSeoMeta({
  title: 'movAi - Duygu Bazlı Film ve Dizi Öneri Sistemi',
  ogTitle: 'movAi - Duygu Bazlı Film ve Dizi Öneri Sistemi',
  description: 'Ruh halinize göre en uygun film ve dizi önerilerini keşfedin. Yapay zeka destekli analiz ile size özel içerik listeleri.',
  ogDescription: 'Ruh halinize göre en uygun film ve dizi önerilerini keşfedin. Yapay zeka destekli analiz ile size özel içerik listeleri.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'movAi - Duygu Bazlı Film ve Dizi Öneri Sistemi',
  twitterDescription: 'Mükemmel film ve dizi önerilerini ruh halinize göre keşfedin.',
  twitterImage: '/og-image.jpg',
})

// Sayfa yüklendiğinde kullanıcı durumunu kontrol et
onMounted(async () => {
  await getCurrentUser()
})
</script>