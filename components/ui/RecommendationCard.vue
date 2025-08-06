<template>
  <div 
    @click="$emit('click')"
    class="group cursor-pointer"
  >
    <div class="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
      <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center overflow-hidden">
        <NuxtImg 
          v-if="movie.poster"
          :src="`https://image.tmdb.org/t/p/w342${movie.poster}`"
          :alt="movie.title"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="text-white/60 text-center p-4">
          <div class="text-3xl mb-2">🎭</div>
          <div class="text-sm font-medium">{{ movie.title }}</div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 class="text-white text-sm font-semibold truncate">{{ movie.title }}</h3>
        <div class="flex items-center mt-1">
          <span class="text-yellow-400 text-xs">⭐</span>
          <span class="text-white/80 text-xs ml-1">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
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
</script> 