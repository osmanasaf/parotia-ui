<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p class="text-sm uppercase tracking-wider text-white/60 mb-1">Your suggestion with AI</p>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white">
            Tailored picks for you
            <span class="text-gradient">today</span>
          </h1>
          <p class="text-white/70 mt-2">Mood: <span class="text-white font-semibold">{{ queryText }}</span></p>
        </div>
        <div v-if="isLoggedIn" class="flex flex-wrap items-center gap-2">
          <button 
            v-for="opt in contentOptions" :key="opt.value"
            :class="['px-3 py-1.5 rounded-full text-sm ring-1 ring-white/15', contentType===opt.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10']"
            @click="setContentType(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
      </div>

      <div v-else>
        <div v-if="topItems.length === 0" class="text-center text-white/70 py-20">No results</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <BackdropCard 
            v-for="it in topItems" 
            :key="`${it.content_type}-${it.tmdb_id}`" 
            :title="it.title"
            :rating="it.vote_average"
            :overview="it.overview || ''"
            :backdrop="it.backdrop_path"
            :poster="it.poster_path"
            @click="openDetail(it)" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import BackdropCard from '~/components/ui/BackdropCard.vue'

const route = useRoute()
const queryText = computed(() => route.query.q?.toString() || '')
const { getHybridRecommendations, getEmotionRecommendations } = useApi()
const { isLoggedIn } = useAuth()

const loading = ref(false)
const items = ref([])
const contentType = ref('all')
const contentOptions = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' }
]

const setContentType = (val) => {
  contentType.value = val
  fetchResults()
}

const fetchResults = async () => {
  if (!queryText.value) return
  loading.value = true
  try {
    const res = isLoggedIn.value
      ? await getHybridRecommendations(queryText.value, contentType.value)
      : await getEmotionRecommendations(queryText.value, 'movie', 1)
    const list = res?.data?.recommendations || []
    items.value = list.map(r => ({
      tmdb_id: r.tmdb_id || r.tmdb_data?.id,
      title: r.title || r.tmdb_data?.title || r.tmdb_data?.name,
      content_type: r.content_type || (r.tmdb_data?.name ? 'tv' : 'movie'),
      vote_average: r.vote_average || r.tmdb_data?.vote_average,
      poster_path: r.poster_path || r.tmdb_data?.poster_path
    }))
  } finally {
    loading.value = false
  }
}

// BackdropCard doğrudan item alanlarından besleniyor

const openDetail = (it) => {
  if (it.content_type === 'tv') navigateTo(`/tv/${it.tmdb_id}`)
  else navigateTo(`/movie/${it.tmdb_id}`)
}

const topItems = computed(() => items.value.slice(0, 10))

watch(() => queryText.value, () => {
  // misafir modda yalnızca movie destekli
  contentType.value = isLoggedIn.value ? 'all' : 'movie'
  fetchResults()
}, { immediate: true })
</script>


