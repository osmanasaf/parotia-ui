<template>
  <div class="relative group overflow-visible">
    <div class="relative rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden transition-all duration-300 ease-out group-hover:shadow-2xl group-hover:ring-white/20 group-hover:scale-[1.06]">
      <NuxtImg
        v-if="poster"
        :src="`https://image.tmdb.org/t/p/w780${poster}`"
        :alt="title"
        class="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 p-3">
        <h4 class="text-white font-semibold text-base line-clamp-1 drop-shadow">{{ title }}</h4>
        <div class="mt-2 flex items-center gap-2">
          <div class="flex items-center gap-2 bg-black/45 backdrop-blur-md rounded-lg px-2 py-2">
            <button @click="goDetail" class="w-9 h-9 rounded-full flex items-center justify-center bg-white text-black shadow hover:bg-white/90" title="Open details">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="relative" @mouseenter="showWatchlistMenu=true" @mouseleave="showWatchlistMenu=false">
              <button @click="toggleWatchlist" class="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" title="Watchlist">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
              </button>
              <transition name="fade">
                <div v-if="showWatchlistMenu" class="absolute bottom-full right-0 mb-2 z-50 rounded-xl backdrop-blur-md bg-black/70 text-white ring-1 ring-white/15 shadow-2xl p-2 min-w-40">
                  <div class="absolute -bottom-1 right-4 w-2 h-2 bg-black/70 rotate-45 ring-1 ring-white/15"></div>
                  <button class="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded" @click="setWatchlist('remove')">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6v14m8-14v14M5 6l1-3h12l1 3"/></svg>
                    <span>Remove</span>
                  </button>
                  <button class="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded" @click="setWatchlist('to_watch')">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    <span>Add</span>
                  </button>
                  <button class="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded" @click="setWatchlist('watched')">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14l-3-3"/></svg>
                    <span>Watched</span>
                  </button>
                </div>
              </transition>
            </div>
            <button @click="openRate = true" class="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" title="Rate">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="openRate" class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div class="w-[420px] rounded-2xl bg-neutral-900/95 ring-1 ring-white/10 shadow-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-white font-semibold text-lg">Rate</h5>
          <button class="text-white/60 hover:text-white" @click="openRate=false" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button
              v-for="n in 10"
              :key="`star-${n}`"
              class="p-1"
              @mouseenter="hoveredRating = n"
              @mouseleave="hoveredRating = 0"
              @click="localRating = n"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" :fill="(hoveredRating || localRating) >= n ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="2">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </button>
          </div>
          <span class="text-white/90 text-sm font-medium ml-3">{{ hoveredRating || localRating }}/10</span>
        </div>
        <textarea v-model="localComment" placeholder="Optional comment" class="mt-4 w-full min-h-24 p-3 rounded-lg bg-neutral-800 text-white placeholder-white/50 ring-1 ring-white/10 focus:outline-none" />
        <div class="mt-4 flex gap-2 justify-end">
          <button class="px-3 py-1.5 rounded-md text-white bg-white/10 hover:bg-white/20" @click="openRate=false">Cancel</button>
          <button class="px-3 py-1.5 rounded-md text-white bg-indigo-600 hover:bg-indigo-500" @click="submitRate">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  poster: { type: String, default: null },
  overview: { type: String, default: '' },
  contentType: { type: String, default: 'movie' }
})

const emit = defineEmits(['play', 'toggle-watchlist', 'rated'])

// Hover state gerekmiyor; group-hover ile hallediyoruz
const openRate = ref(false)
const localRating = ref(7)
const hoveredRating = ref(0)
const localComment = ref('')
const showWatchlistMenu = ref(false)

const { rateContent } = useContent()
const setWatchlist = async (status) => {
  const endpoint = props.contentType === 'tv' ? '/api/tv/watchlist' : '/api/movies/watchlist'
  await $fetch(endpoint, { method: 'POST', body: { tmdb_id: props.id, content_type: props.contentType, status } })
}

const toggleWatchlist = async () => {
  emit('toggle-watchlist')
  await setWatchlist('to_watch')
}

const goDetail = () => {
  const path = props.contentType === 'tv' ? `/tv/${props.id}` : `/movie/${props.id}`
  navigateTo(path)
}

const submitRate = async () => {
  await rateContent({ tmdbId: props.id, contentType: props.contentType, rating: localRating.value, comment: localComment.value })
  emit('rated', { rating: localRating.value, comment: localComment.value })
  openRate.value = false
}
</script>

<style scoped>
@reference "tailwindcss";
.watch-card { box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.btn-circle { @apply w-10 h-10 rounded-full flex items-center justify-center transition-colors; }
.btn-primary { @apply bg-white text-black hover:bg-white/90; }
.btn-glass { @apply bg-white/15 text-white hover:bg-white/25 ring-1 ring-white/20; }
.popover-menu { @apply absolute bottom-full right-0 mb-2 z-50 rounded-xl backdrop-blur-md bg-black/70 text-white ring-1 ring-white/15 shadow-2xl p-2 min-w-40; }
.popover-caret { @apply absolute -bottom-1 right-4 w-2 h-2 bg-black/70 rotate-45 ring-1 ring-white/15; }
.popover-item { @apply w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded; }
.glass-modal { @apply rounded-2xl p-4 bg-white/10 ring-1 ring-white/15 backdrop-blur-md; }
.btn { @apply px-3 py-1.5 rounded-md text-white transition-colors; }
.btn.primary { @apply bg-indigo-600 hover:bg-indigo-500; }
.btn.ghost { @apply bg-white/10 hover:bg-white/20; }
.fade-enter-active,.fade-leave-active{transition:opacity .2s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>


