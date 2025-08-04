<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
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
</script>