<template>
  <div v-if="recommendedMovies.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
    <div class="mb-8">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
        Recommended for you
      </h2>
      <p class="text-xl text-white/70">
        Based on your mood: "{{ emotionInput }}"
      </p>
    </div>

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
</script> 