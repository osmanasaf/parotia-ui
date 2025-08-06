<template>
  <div 
    class="group cursor-pointer flex-shrink-0 w-48"
    @click="$emit('click')"
  >
    <div class="relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
      <div class="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
        <NuxtImg 
          v-if="movie.poster"
          :src="`https://image.tmdb.org/t/p/w342${movie.poster}`" 
          :alt="movie.title"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="$event.target.style.display='none'"
        />
        <div v-else class="text-white/60 text-center p-4">
          <div class="text-3xl mb-2">🎬</div>
          <div class="text-sm font-medium">{{ movie.title }}</div>
        </div>
      </div>
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 class="text-white text-sm font-semibold truncate">{{ movie.title }}</h3>
        <div class="flex items-center justify-between mt-1">
          <div class="flex items-center">
            <span class="text-yellow-400 text-xs">⭐</span>
            <span class="text-white/80 text-xs ml-1">{{ movie.rating?.toFixed(1) || 'N/A' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="isLoggedIn"
              @click.stop="handleAddToWatchlist"
              class="bg-blue-600/80 hover:bg-blue-600 rounded-full p-1 transition-all"
              title="Add to Watchlist"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
            <button 
              @click.stop="showInfo"
              class="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
              title="Movie Info"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dumb component - receives props and emits events
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const { isLoggedIn } = useAuth()
const { addToWatchlist } = useApi()

const handleAddToWatchlist = async () => {
  try {
    await addToWatchlist(props.movie.id, 'movie', 'to_watch')
    console.log(`${props.movie.title} added to watchlist!`)
  } catch (error) {
    console.error('Failed to add to watchlist:', error)
  }
}

const showInfo = () => {
  emit('click')
}
</script> 