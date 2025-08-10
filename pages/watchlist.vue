<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Watchlist</h2>
        <label class="flex items-center gap-2 text-white/80">
          <span>Hide watched</span>
          <input type="checkbox" v-model="hideWatched" class="w-5 h-5 rounded" />
        </label>
      </div>

      <div v-if="!isLoggedIn" class="text-white/80">Please log in.</div>

      <div v-else class="space-y-4">
        <div 
          v-for="item in filteredItems" 
          :key="`${item.contentType}-${item.id}`"
          class="flex items-center gap-4 bg-white/5 ring-1 ring-white/10 rounded-2xl p-4 hover:bg-white/7 transition-colors"
        >
          <NuxtImg :src="item.poster_path ? `https://image.tmdb.org/t/p/w154${item.poster_path}` : ''" alt="poster" class="w-[64px] h-[96px] rounded-lg object-cover bg-white/10" />
          <div class="flex-1 min-w-0">
            <div class="text-white font-semibold truncate">{{ item.title }}</div>
            <div class="text-white/60 text-sm">{{ item.year }}</div>
            <button
              class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ring-1 ring-white/15"
              :class="item.statusLocal === 'watched' ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/85 hover:bg-white/20'"
              @click="onToggleWatched(item)"
            >
              <svg v-if="item.statusLocal === 'watched'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              <span>Watched</span>
            </button>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="item.user_rating" class="flex items-center gap-1 text-yellow-400" title="Your rating">
              <svg v-for="n in 10" :key="`r-${n}`" class="w-4 h-4" viewBox="0 0 24 24" :fill="n <= item.user_rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <button class="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20" @click="openRate(item)">Rate</button>
            <button class="px-3 py-2 rounded-lg bg-white/5 text-red-300 hover:bg-red-500/10 ring-1 ring-white/10" @click="onDelete(item)" title="Remove">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6v14m8-14v14M5 6l1-3h12l1 3"/></svg>
            </button>
          </div>
        </div>
      </div>

      <RateModal v-model:open="rateOpen" v-model:modelValue="rateValue" :comment="rateComment" @save="onSaveRate" />
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import RateModal from '~/components/ui/RateModal.vue'

const { isLoggedIn } = useAuth()
const { loadMyWatchlist, rateContent } = useContent()
const { getAuthHeaders } = useTokenManager()

const items = ref([])
const hideWatched = ref(false)

const rateOpen = ref(false)
const rateValue = ref(7)
const rateComment = ref('')
let currentItem = null

const loadData = async () => {
  const res = await loadMyWatchlist()
  items.value = Array.isArray(res.items) ? res.items.map(i => ({ ...i, statusLocal: i.status })) : []
}

const filteredItems = computed(() => items.value.filter(i => (hideWatched.value ? i.statusLocal !== 'watched' : true)))

const openRate = (item) => {
  currentItem = item
  rateValue.value = item.user_rating || 7
  rateComment.value = item.user_comment || ''
  rateOpen.value = true
}

const onSaveRate = async ({ rating, comment }) => {
  if (!currentItem) return
  await rateContent({ tmdbId: currentItem.id, contentType: currentItem.contentType, rating, comment })
  rateOpen.value = false
  // UI'da son rating'i göster
  items.value = items.value.map(i => i.id === currentItem.id && i.contentType === currentItem.contentType ? { ...i, user_rating: rating, user_comment: comment } : i)
}

const onToggleWatched = async (item) => {
  item.statusLocal = item.statusLocal === 'watched' ? 'to_watch' : 'watched'
  const endpoint = item.contentType === 'tv' ? '/api/tv/watchlist' : '/api/movies/watchlist'
  await $fetch(endpoint, { method: 'POST', body: { tmdb_id: item.id, content_type: item.contentType, status: item.statusLocal }, headers: getAuthHeaders() })
}

const onDelete = async (item) => {
  if (!confirm('Are you sure you want to remove this from your watchlist?')) return
  const endpoint = item.contentType === 'tv' ? '/api/tv/watchlist' : '/api/movies/watchlist'
  await $fetch(endpoint, { method: 'POST', body: { tmdb_id: item.id, content_type: item.contentType, status: 'remove' }, headers: getAuthHeaders() })
  items.value = items.value.filter(i => !(i.id === item.id && i.contentType === item.contentType))
}

onMounted(loadData)
useHead({ title: 'Watchlist - Parotia' })
</script>


