<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
    <div class="mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/15 text-white/80 text-xs uppercase tracking-wide">
        <span>AI Önerisi</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>
      <div class="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            Sizin için önerilenler
          </h2>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-white/70">Ruh hâline göre:</span>
            <span class="px-2 py-1 rounded-full text-sm bg-white/10 ring-1 ring-white/15 text-white">{{ emotionInput || '—' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20"
            @click="goToResults"
            :disabled="!emotionInput.trim()"
            title="Tüm sonuçları gör"
          >
            Tümünü gör
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
            @click="goToResults"
            :disabled="!emotionInput.trim()"
            title="Önerileri yenile"
          >
            Önerileri yenile
          </button>
        </div>
      </div>
    </div>

    <template v-if="recommendedMovies.length > 0">
      <div class="relative rounded-3xl bg-white/5 ring-1 ring-white/10 p-4 md:p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          <RecommendationCard 
            v-for="movie in recommendedMovies" 
            :key="movie.tmdb_id"
            :movie="movie"
            @click="navigateToMovie(movie.tmdb_id)"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="rounded-3xl bg-white/5 ring-1 ring-white/10 p-10 text-center">
        <div class="text-5xl mb-3">🎯</div>
        <h3 class="text-xl font-semibold text-white mb-2">Henüz gösterilecek öneri yok</h3>
        <p class="text-white/70">Ruh hâlini yaz ve sana özel öneriler oluşturalım.</p>
      </div>
    </template>
  </div>
  
</template>

<script setup>
// Smart component - handles recommendations logic
import RecommendationCard from '~/components/ui/RecommendationCard.vue'

const props = defineProps({
  emotionInput: {
    type: String,
    required: true
  }
})

const contentStore = useContentStore()
const { navigateToContent } = useContent()

const recommendedMovies = computed(() => contentStore.recommendedMovies)

const navigateToMovie = (movieId) => {
  navigateToContent(movieId)
}

const goToResults = () => {
  if (!props.emotionInput?.trim()) return
  navigateTo({ path: '/results', query: { q: props.emotionInput } })
}
</script> 