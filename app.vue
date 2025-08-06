<template>
  <div>
    <NuxtPage />
    <ClientOnly>
      <AuthModal />
    </ClientOnly>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { AuthModal } from '~/components/ui'

const { getCurrentUser } = useAuth()

useHead({
  htmlAttrs: {
    lang: 'tr'
  },
  meta: [
    { name: 'theme-color', content: '#a855f7' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
  ]
})

// Sayfa yüklendiğinde kullanıcı durumunu kontrol et
onMounted(async () => {
  await getCurrentUser()
})
</script>