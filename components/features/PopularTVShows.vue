<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-8">
      <h2 class="text-4xl md:text-5xl font-bold font-space text-white mb-4">
        📺 Popular <span class="text-gradient">TV Shows</span>
      </h2>
      <p class="text-xl text-white/70">
        Binge-worthy series everyone's talking about
      </p>
    </div>

    <div class="relative group">
      <!-- Left Navigation Button -->
      <button 
        @click="scrollCarousel('left')"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- Right Navigation Button -->
      <button 
        @click="scrollCarousel('right')"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      <div 
        ref="carousel"
        class="flex overflow-x-auto scrollbar-hide gap-6 pb-4 scroll-smooth" 
        @mouseenter="pauseAutoScroll"
        @mouseleave="resumeAutoScroll"
      >
        <TVShowCard 
          v-for="show in popularTVShows" 
          :key="show.id"
          :show="show"
          @click="navigateToShow(show.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Smart component - handles popular TV shows logic
import TVShowCard from '~/components/ui/TVShowCard.vue'

const contentStore = useContentStore()
const { loadPopularTVShows, navigateToContent } = useContent()

const carousel = ref(null)
const autoScrollInterval = ref(null)

const popularTVShows = computed(() => contentStore.popularTVShows)

const scrollCarousel = (direction) => {
  if (!carousel.value) return
  
  const scrollAmount = 300
  const currentScroll = carousel.value.scrollLeft
  
  if (direction === 'left') {
    carousel.value.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth'
    })
  } else {
    carousel.value.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth'
    })
  }
}

const startAutoScroll = () => {
  autoScrollInterval.value = setInterval(() => {
    if (!carousel.value) return
    
    const maxScroll = carousel.value.scrollWidth - carousel.value.clientWidth
    const currentScroll = carousel.value.scrollLeft
    
    if (currentScroll >= maxScroll) {
      carousel.value.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      carousel.value.scrollTo({ left: currentScroll + 300, behavior: 'smooth' })
    }
  }, 4000)
}

const pauseAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}

const resumeAutoScroll = () => {
  if (!autoScrollInterval.value) {
    startAutoScroll()
  }
}

const navigateToShow = (showId) => {
  navigateToContent({ id: showId, media_type: 'tv' })
}

onMounted(() => {
  startAutoScroll()
})

onBeforeUnmount(() => {
  pauseAutoScroll()
})
</script> 