<template>
  <div class="relative overflow-hidden py-24">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-5xl md:text-7xl font-bold font-space text-white mb-8">
        Ruh hâline en uygun 
        <span class="text-gradient">içerik</span><br/>
        şimdi karşında
      </h1>
      <p class="text-2xl text-white/80 mb-16 max-w-3xl mx-auto font-light">
        <span class="text-gradient font-semibold">Yapay zekâ destekli</span> öneri motorumuz, o anki ruh hâline uyan
        film ve dizileri saniyeler içinde önerir.
      </p>
      
      <div class="max-w-4xl mx-auto mb-16">
        <div class="relative">
          <div class="modern-input-container">
            <div class="mood-indicator pause"></div>
            <input 
              v-model="emotionInput"
              type="text" 
              placeholder="Bugün kendini nasıl hissediyorsun?"
              class="modern-input"
            >
            <button 
              @click="handleGetRecommendations"
              :disabled="!emotionInput.trim() || isLoading"
              class="modern-input-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Smart component - handles emotion search logic
const emotionInput = ref('')
const contentStore = useContentStore()
const { getRecommendations } = useContent()
const { isLoggedIn } = useAuth()

const isLoading = computed(() => contentStore.isLoading)

const handleGetRecommendations = async () => {
  if (!emotionInput.value.trim()) return
  // Sonuç sayfasına yönlendirelim ve query üzerinden inputu geçelim
  navigateTo({ path: '/results', query: { q: emotionInput.value } })
}
</script> 