<template>
  <footer class="border-t border-white/10 bg-black/20 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-white/70 text-sm">
          <NuxtLink to="/privacy-policy" class="hover:text-white transition-colors">Gizlilik Politikası</NuxtLink>
          <span class="text-white/30">|</span>
          <NuxtLink to="/terms-of-service" class="hover:text-white transition-colors">Hizmet Koşulları</NuxtLink>
          <span class="text-white/30">|</span>
          <NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink>
        </div>

        <div class="text-white/60 text-sm text-center">
          Kâr amacı gütmeyen bir projedir | movAi
        </div>

        <div class="flex items-center gap-2">
          <a href="https://www.linkedin.com/in/osman-asaf-tatar/" target="_blank" rel="noopener" aria-label="LinkedIn"
             class="rounded-md p-2 bg-white/10 hover:bg-white/20 text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V24h-5v-7.3c0-1.7 0-3.9-2.4-3.9-2.4 0-2.7 1.9-2.7 3.8V24h-5V8z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>


