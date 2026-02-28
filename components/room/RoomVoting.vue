<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center py-8 md:py-12 px-4 relative">
    <!-- Background Header Stats -->
    <div class="absolute top-4 md:top-8 left-0 right-0 px-4 md:px-6 flex items-center justify-between z-10 transition-all">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span class="text-xs font-bold uppercase tracking-widest text-white/50">CANLI OYLAMA</span>
        </div>
        <transition name="slide-fade">
          <div v-if="latestInterimMatch" class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            {{ latestInterimMatch.title }} Eşleşti!
          </div>
        </transition>
      </div>
      <div class="flex items-center gap-4">
        <button 
          v-if="isCreator"
          @click="forceEndVoting"
          :disabled="ending"
          class="px-4 py-2 bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-widest rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {{ ending ? 'Bitiriliyor...' : 'Oylamayı Bitir' }}
        </button>
        <div class="bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
          <span class="text-amber-500 font-mono font-bold">{{ timeLeft }}</span>
        </div>
      </div>
    </div>

    <!-- Card Stack -->
    <div class="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] aspect-[2/3] perspective-1000">
      <div 
        v-for="(movie, index) in visibleCards" 
        :key="movie.tmdb_id"
        class="absolute inset-0 transition-transform duration-300 card-container"
        :style="getCardStyle(index, visibleCards.length)"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
      >
        <div class="w-full h-full bg-[var(--bg-elevated)] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative select-none touch-none">
          <NuxtImg 
            :src="`https://image.tmdb.org/t/p/w780${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-full object-cover pointer-events-none"
            loading="lazy"
          />
          
          <!-- Overlay Info -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
          
          <div class="absolute bottom-0 left-0 right-0 p-8 pt-20 pointer-events-none">
            <h3 class="text-3xl font-bold mb-3 drop-shadow-xl">{{ movie.title }}</h3>
            <div class="flex items-center gap-3 text-sm text-white/70 font-medium">
              <span>{{ movie.release_year }}</span>
              <span>•</span>
              <div class="flex items-center gap-1 text-amber-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>{{ movie.vote_average?.toFixed(1) }}</span>
              </div>
            </div>
            <p class="mt-4 text-xs text-white/50 line-clamp-2 leading-relaxed">{{ movie.overview }}</p>
          </div>

          <!-- Swipe Feedback Icons -->
          <div 
            class="absolute top-10 left-10 opacity-0 swipe-icon right-icon"
            :style="{ opacity: swipeProgress > 0.2 ? swipeProgress : 0 }"
          >
            <div class="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 scale-125 rotate-[-20deg]">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
          <div 
            class="absolute top-10 right-10 opacity-0 swipe-icon left-icon"
            :style="{ opacity: swipeProgress < -0.2 ? Math.abs(swipeProgress) : 0 }"
          >
            <div class="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center text-rose-500 scale-125 rotate-[20deg]">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Stack State -->
      <div v-if="recommendations.length > 0 && recommendations.length === currentIndex" class="flex flex-col items-center text-center px-8 z-10">
        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
          <svg class="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Tüm Kartlar Bitti</h3>
        <p class="text-white/40 text-sm">Diğer katılımcıların oylamayı bitirmesi veya sürenin dolması bekleniyor...</p>
      </div>
    </div>

    <!-- Swipe Controls -->
    <div v-if="recommendations.length > currentIndex" class="mt-12 flex items-center gap-8 z-10">
      <button 
        @click="swipeLeftManual"
        class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <button 
        @click="swipeUpManual"
        class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 hover:bg-amber-500/10 transition-all active:scale-90"
      >
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </button>
      <button 
        @click="swipeRightManual"
        class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition-all active:scale-90"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isCreator: Boolean,
  code: String
})

const roomStore = useRoomStore()
const { sendSwipe, forceFinish } = useRoomWs()
const { getAuthHeaders } = useTokenManager()

const ending = ref(false)

const recommendations = computed(() => roomStore.recommendations)
const currentIndex = ref(0)
// Doğal sırayla tut: index 0 = altta, son index = üstte (ters çevirmeden hesap)
const visibleCards = computed(() => {
  return recommendations.value.slice(currentIndex.value, currentIndex.value + 3)
})

const latestInterimMatch = computed(() => {
  const matches = roomStore.interimMatches
  return matches.length > 0 ? matches[matches.length - 1] : null
})

// Dismiss toast after a while
watch(latestInterimMatch, (newVal) => {
  if (newVal) {
    // Optionally auto-dismiss, but leaving it sticky or until next match is also fine
  }
})

const startX = ref(0)
const startY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const swipeProgress = ref(0) // -1 to 1

const timeLeft = ref('00:00')

// Swipe logic
const handleMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleTouchStart = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  offsetX.value = e.clientX - startX.value
  offsetY.value = e.clientY - startY.value
  swipeProgress.value = offsetX.value / 150
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  offsetX.value = e.touches[0].clientX - startX.value
  offsetY.value = e.touches[0].clientY - startY.value
  swipeProgress.value = offsetX.value / 150
}

const handleMouseUp = () => {
  finishSwipe()
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const handleTouchEnd = () => {
  finishSwipe()
}

const finishSwipe = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const movie = recommendations.value[currentIndex.value]
  if (!movie) return

  if (offsetX.value > 100) {
    recordSwipe(movie.tmdb_id, 'LIKE')
  } else if (offsetX.value < -100) {
    recordSwipe(movie.tmdb_id, 'DISLIKE')
  } else if (offsetY.value < -100) {
    recordSwipe(movie.tmdb_id, 'SUPERLIKE')
  } else {
    // Reset
    offsetX.value = 0
    offsetY.value = 0
    swipeProgress.value = 0
  }
}

const recordSwipe = (id, action) => {
  sendSwipe(id, action)
  
  // Transition animation would be nice here
  currentIndex.value++
  offsetX.value = 0
  offsetY.value = 0
  swipeProgress.value = 0
}

const swipeLeftManual = () => {
  offsetX.value = -200
  finishSwipe()
}
const swipeRightManual = () => {
  offsetX.value = 200
  finishSwipe()
}
const swipeUpManual = () => {
  offsetY.value = -200
  offsetX.value = 0
  isDragging.value = true // needed for finishSwipe to work
  finishSwipe()
}

const getCardStyle = (index, total) => {
  // Dizideki son eleman üsttedir (sürüklenen kart)
  const isTop = index === total - 1
  if (isTop && isDragging.value) {
    return {
      transform: `translate(${offsetX.value}px, ${offsetY.value}px) rotate(${offsetX.value / 20}deg)`,
      zIndex: 100,
      transition: 'none'
    }
  }

  // Üstten mesafe: 0 = üst kart, 1 = bir alttaki, 2 = en alttaki
  const depthFromTop = (total - 1) - index
  return {
    transform: `scale(${1 - depthFromTop * 0.05}) translateY(${depthFromTop * 15}px)`,
    zIndex: index,
    opacity: 1 - depthFromTop * 0.3
  }
}

// Timer logic
const updateTimer = () => {
  if (!roomStore.expiresAt) return
  const now = new Date().getTime()
  const exp = new Date(roomStore.expiresAt).getTime()
  const diff = Math.max(0, exp - now)
  
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  timeLeft.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  
  if (diff === 0) {
    // Voting ended
  }
}

let timerInt = null
onMounted(() => {
  timerInt = setInterval(updateTimer, 1000)
})
onUnmounted(() => {
  clearInterval(timerInt)
})

const forceEndVoting = () => {
  ending.value = true
  forceFinish()
  // Disable button while waiting for match_found/no_match event
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.card-container {
  will-change: transform;
}
.swipe-icon {
  pointer-events: none;
  transition: opacity 0.1s ease;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
