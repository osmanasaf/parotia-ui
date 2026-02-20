<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p class="text-sm uppercase tracking-wider text-white/60 mb-1">Yapay zekâ ile öneriler</p>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white">
            Size özel öneriler
            <span class="text-gradient">bugün</span>
          </h1>
          <p class="text-white/70 mt-2">Ruh hâli: <span class="text-white font-semibold">{{ queryText }}</span></p>
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

      <div v-if="loading && items.length === 0" class="flex items-center justify-center py-20">
        <CinemaSpinner size="lg" label="Yapay zekâ önerilerini hazırlıyor..." />
      </div>

      <div v-else>
        <div v-if="topItems.length === 0" class="text-center text-white/70 py-20">Sonuç bulunamadı</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="it in items" 
            :key="`${it.content_type}-${it.tmdb_id}`" 
            class="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-blue-500/40 transition-all cursor-pointer"
            @click="openDetail(it)"
          >
            <div class="relative">
              <NuxtImg
                v-if="getImageSrc(it)"
                :src="getImageSrc(it)"
                :alt="it.title"
                class="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div v-else class="w-full aspect-[2/3] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white/60 text-sm">{{ it.title }}</div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/15 text-white/90 uppercase tracking-wide">{{ it.content_type }}</span>
                <span v-if="it.release_year" class="px-2 py-0.5 rounded-full text-[10px] bg-white/15 text-white/90">{{ it.release_year }}</span>
              </div>
              <div class="absolute bottom-3 left-3 right-3">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-white font-semibold truncate">{{ it.title }}</h3>
                  <div class="flex items-center gap-1 text-yellow-400 text-sm flex-shrink-0">
                    <span>⭐</span>
                    <span class="text-white/90">{{ (it.vote_average ?? 0).toFixed(1) }}</span>
                  </div>
                </div>
                <div class="mt-2 flex items-center justify-between gap-3">
                  <div v-if="it.score != null" class="flex-1">
                    <div class="flex items-center justify-between text-[11px] text-white/80">
                      <span>Benzerlik</span>
                      <span class="font-semibold">{{ formatScore(it.score) }}</span>
                    </div>
                    <div class="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400" 
                        :style="{ width: formatScore(it.score) }"
                      ></div>
                    </div>
                  </div>
                  <button 
                    @click.stop="handleAddToWatchlist(it)" 
                    :class="[
                      'px-3 py-1.5 rounded-lg text-sm text-white transition-all flex-shrink-0 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
                      addedWatchlist[getKey(it)] ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                    ]"
                    :disabled="savingWatchlist[getKey(it)] || addedWatchlist[getKey(it)] || !isLoggedIn"
                  >
                    <span v-if="savingWatchlist[getKey(it)]" class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <svg v-else-if="addedWatchlist[getKey(it)]" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 20l6-4 6 4V6a2 2 0 00-2-2H8a2 2 0 00-2 2z"/>
                      <path d="M12 11v6"/>
                      <path d="M9 14h6"/>
                    </svg>
                    <span>{{ savingWatchlist[getKey(it)] ? 'Ekleniyor…' : (addedWatchlist[getKey(it)] ? 'Eklendi' : 'İzleme Listeme Ekle') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-center" v-if="hasMore">
          <button 
            @click="loadMore" 
            class="px-4 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20 disabled:opacity-60"
            :disabled="loadingMore"
          >
            <span v-if="loadingMore" class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
            {{ loadingMore ? 'Yükleniyor…' : 'Daha fazla yükle' }}
          </button>
        </div>
        <div ref="sentinel" class="h-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import CinemaSpinner from '~/components/ui/CinemaSpinner.vue'
const { addToWatchlist: apiAddToWatchlist } = useApi()

const route = useRoute()
const queryText = computed(() => route.query.q?.toString() || '')
const { getHybridRecommendations, getEmotionRecommendations } = useApi()
const { isLoggedIn } = useAuth()

const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const items = ref([])
const contentType = ref('all')
const savingWatchlist = ref({})
const addedWatchlist = ref({})
const sentinel = ref(null)
const getKey = (it) => `${it.content_type}-${it.tmdb_id}`
const contentOptions = [
  { label: 'Tümü', value: 'all' },
  { label: 'Filmler', value: 'movie' },
  { label: 'Diziler', value: 'tv' }
]

const setContentType = (val) => {
  contentType.value = val
  resetAndFetch()
}

const resetAndFetch = () => {
  page.value = 1
  hasMore.value = true
  items.value = []
  fetchResults()
}

const fetchResults = async () => {
  if (!queryText.value || !hasMore.value) return
  if (items.value.length === 0) loading.value = true
  else loadingMore.value = true
  try {
    const isGuest = !isLoggedIn.value
    const res = isGuest
      ? await getEmotionRecommendations(queryText.value, 'all', page.value)
      : await getHybridRecommendations(queryText.value, contentType.value, page.value)
    const list = res?.data?.recommendations || []
    const mapped = list.map(r => ({
      tmdb_id: r.tmdb_id || r.tmdb_data?.id,
      title: r.title || r.tmdb_data?.title || r.tmdb_data?.name,
      content_type: r.content_type || (r.tmdb_data?.name ? 'tv' : 'movie'),
      vote_average: r.vote_average ?? r.tmdb_data?.vote_average ?? null,
      backdrop_path: r.backdrop_path ?? r.tmdb_data?.backdrop_path ?? null,
      poster_path: r.poster_path ?? r.tmdb_data?.poster_path ?? null,
      release_year: (r.release_date || r.tmdb_data?.release_date || r.tmdb_data?.first_air_date || '').slice(0,4) || null,
      score: r.score ?? r.recommendation_score ?? null
    }))
    items.value = [...items.value, ...mapped]
    if (page.value >= 4 || list.length === 0) {
      hasMore.value = false
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && hasMore.value && !loadingMore.value) {
        page.value += 1
        fetchResults()
      }
    })
  }, { rootMargin: '200px' })
  if (sentinel.value) io.observe(sentinel.value)
})

const getImageSrc = (it) => {
  const path = it.poster_path || it.backdrop_path
  if (!path) return ''
  const size = it.poster_path ? 'w342' : 'w780'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const formatScore = (s) => `${Math.round((s ?? 0) * 100)}%`

const handleAddToWatchlist = async (it) => {
  const key = getKey(it)
  savingWatchlist.value[key] = true
  try {
    await apiAddToWatchlist(it.tmdb_id, it.content_type, 'to_watch')
    addedWatchlist.value[key] = true
  } catch (e) {
    console.error('add to watchlist failed', e)
  } finally {
    savingWatchlist.value[key] = false
  }
}

const openDetail = (it) => {
  if (it.content_type === 'tv') navigateTo(`/tv/${it.tmdb_id}`)
  else navigateTo(`/movie/${it.tmdb_id}`)
}

const topItems = computed(() => items.value.slice(0, 10))

watch(() => queryText.value, () => {
  // misafir modda 'all' desteklenir
  contentType.value = 'all'
  resetAndFetch()
}, { immediate: true })

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return
  page.value += 1
  fetchResults()
}
</script>




