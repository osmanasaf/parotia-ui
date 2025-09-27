<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    
    <EmotionSearch />
    
    <PopularMovies />
    
    <PopularTVShows />
    
    <Recommendations :emotion-input="emotionInput" />
    
    <LoginModal />
  </div>
</template>

<script setup>
// Main page component - orchestrates features
import AppHeader from '~/components/layout/AppHeader.vue'
import EmotionSearch from '~/components/features/EmotionSearch.vue'
import PopularMovies from '~/components/features/PopularMovies.vue'
import PopularTVShows from '~/components/features/PopularTVShows.vue'
import Recommendations from '~/components/features/Recommendations.vue'
import LoginModal from '~/components/ui/LoginModal.vue'

const emotionInput = ref('')

// Import composables
const { loadPopularMovies, loadPopularTVShows } = useContent()

// Load initial data
onMounted(async () => {
  try {
    console.log('Loading initial data...')
    await loadPopularMovies()
    await loadPopularTVShows()
    console.log('Initial data loaded successfully')
  } catch (error) {
    console.error('Initial data loading error:', error)
  }
})

useHead({
  title: 'movAi - Duygu Bazlı Film Öneri Sistemi',
  meta: [
    { name: 'description', content: 'Ruh halinize göre mükemmel film ve dizi önerilerini keşfedin.' }
  ]
})
</script>