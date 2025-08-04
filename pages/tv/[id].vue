<template>
  <div class="min-h-screen gradient-dark relative">
    <div 
      v-if="tvDetail?.backdrop_path" 
      class="absolute inset-0 z-0"
    >
      <img 
        :src="`https://image.tmdb.org/t/p/w1280${tvDetail.backdrop_path}`"
        :alt="tvDetail.name"
        class="w-full h-full object-cover opacity-20"
      >
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80"></div>
    </div>
    <nav class="glass-effect sticky top-0 z-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-3xl font-bold font-space text-gradient">
                  🐦 PAROTIA
                </h1>
              </div>
            </NuxtLink>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">← Back</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p class="text-white/80">TV show details loading...</p>
      </div>
    </div>

    <div v-else-if="tvDetail" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div class="lg:col-span-1">
          <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
            <img 
              v-if="tvDetail.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${tvDetail.poster_path}`"
              :alt="tvDetail.name"
              class="w-full h-full object-cover rounded-2xl"
            >
            <div v-else class="text-white/60 text-center p-8">
              <div class="text-6xl mb-4">📺</div>
              <div class="text-lg font-medium">{{ tvDetail.name }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ tvDetail.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-white/80 mb-6">
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="ml-1 font-semibold">{{ tvDetail.vote_average?.toFixed(1) || 'N/A' }}</span>
              </div>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.first_air_date || '2024' }}</span>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.number_of_seasons || '1' }} Season{{ (tvDetail.number_of_seasons || 1) > 1 ? 's' : '' }}</span>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.number_of_episodes || '10' }} Episodes</span>
            </div>
          </div>

          <div v-if="tvDetail.genres?.length">
            <h3 class="text-lg font-semibold text-white mb-3">Genres</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in tvDetail.genres" 
                :key="genre.id"
                class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm"
              >
                {{ genre.name }}
              </span>
            </div>
          </div>

          <div v-if="tvDetail.overview">
            <h3 class="text-lg font-semibold text-white mb-3">Overview</h3>
            <p class="text-white/80 leading-relaxed">
              {{ tvDetail.overview }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="tvDetail.cast?.length">
              <h3 class="text-lg font-semibold text-white mb-3">Cast</h3>
              <div class="space-y-1">
                <p 
                  v-for="actor in tvDetail.cast.slice(0, 5)" 
                  :key="actor"
                  class="text-white/70 text-sm"
                >
                  {{ actor }}
                </p>
              </div>
            </div>
            
            <div v-if="tvDetail.seasons?.length">
              <h3 class="text-lg font-semibold text-white mb-3">Seasons</h3>
              <div class="space-y-2">
                <div 
                  v-for="season in tvDetail.seasons.slice(0, 3)" 
                  :key="season.id"
                  class="bg-white/5 rounded-lg p-3"
                >
                  <p class="text-white font-medium">{{ season.name }}</p>
                  <p class="text-white/60 text-sm">{{ season.episode_count }} episodes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            🔍 Where to Watch
          </h2>
          <div class="flex items-center">
            <label for="country-select" class="text-white/80 mr-3">Country:</label>
            <select 
              id="country-select"
              v-model="selectedCountry" 
              @change="loadWatchProviders"
              class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TR">🇹🇷 Turkey</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="DE">🇩🇪 Germany</option>
            </select>
          </div>
        </div>

        <div v-if="isLoadingProviders" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p class="text-white/70">Loading streaming platforms...</p>
        </div>

        <div v-else-if="watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="provider in watchProviders" 
            :key="provider.provider_id"
            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <div class="text-3xl mb-2">📺</div>
            <h3 class="text-white font-semibold text-sm">{{ provider.provider_name }}</h3>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-6xl mb-4">😔</div>
          <h3 class="text-xl font-semibold text-white mb-2">No Streaming Info Available</h3>
          <p class="text-white/70">Streaming information is not available for this content yet.</p>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">
          🎭 Similar TV Shows
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="similar in similarShows" 
            :key="similar.id"
            @click="goToTV(similar.id)"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
              <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="similar.poster"
                  :src="`https://image.tmdb.org/t/p/w342${similar.poster}`"
                  :alt="similar.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display = 'none'"
                >
                <div v-else class="text-white/60 text-center p-4">
                  <div class="text-3xl mb-2">📺</div>
                  <div class="text-sm font-medium">{{ similar.name }}</div>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 class="text-white text-sm font-semibold truncate">{{ similar.name }}</h3>
                <div class="flex items-center mt-1">
                  <span class="text-yellow-400 text-xs">⭐</span>
                  <span class="text-white/80 text-xs ml-1">{{ similar.rating?.toFixed(1) || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="text-6xl mb-4">😞</div>
        <h2 class="text-2xl font-bold text-white mb-2">TV Show Not Found</h2>
        <p class="text-white/70 mb-6">The TV show you're looking for doesn't exist or an error occurred.</p>
        <NuxtLink 
          to="/" 
          class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          Back to Homepage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tvId = route.params.id

const tvDetail = ref(null)
const watchProviders = ref([])
const similarShows = ref([])
const isLoading = ref(true)
const isLoadingProviders = ref(false)
const selectedCountry = ref('TR')
const mockSimilarShows = [
  { id: 201, name: 'Similar Show 1', rating: 7.8 },
  { id: 202, name: 'Similar Show 2', rating: 8.1 },
  { id: 203, name: 'Similar Show 3', rating: 7.3 },
  { id: 204, name: 'Similar Show 4', rating: 6.9 },
  { id: 205, name: 'Similar Show 5', rating: 7.6 },
  { id: 206, name: 'Similar Show 6', rating: 8.0 },
]

const loadTVDetail = async () => {
  isLoading.value = true
  
  try {
    const { getTVDetail } = useApi()
    const response = await getTVDetail(tvId)
    
    if (response.success && response.data) {
      const data = response.data
      tvDetail.value = {
        id: data.id,
        name: data.name,
        overview: data.overview,
        vote_average: data.vote_average,
        first_air_date: data.first_air_date,
        last_air_date: data.last_air_date,
        number_of_seasons: data.number_of_seasons,
        number_of_episodes: data.number_of_episodes,
        genres: data.genres || [],
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        cast: data.cast || [],
        crew: data.crew || [],
        seasons: data.seasons || []
      }
    }
    
    similarShows.value = mockSimilarShows
    
    await loadWatchProviders()
    
  } catch (error) {
    console.error('TV show details loading error:', error)
    const { getTVDetail } = useApi()
    // Use mock data if API fails
    tvDetail.value = {
      id: tvId,
      name: `Amazing TV Show ${tvId}`,
      overview: 'This incredible TV show captivates viewers with its compelling storyline. Perfect acting, impressive visual effects, and strong writing provide a complete television experience.',
      vote_average: 8.5,
      first_air_date: '2024-01-15',
      last_air_date: '2024-12-15',
      number_of_seasons: 3,
      number_of_episodes: 30,
      genres: [
        {id: 18, name: "Drama"},
        {id: 10765, name: "Sci-Fi & Fantasy"}
      ],
      poster_path: null,
      backdrop_path: null,
      cast: ['Lead Actor 1', 'Lead Actor 2', 'Famous Actor 3'],
      seasons: [
        {id: 1, name: 'Season 1', episode_count: 10},
        {id: 2, name: 'Season 2', episode_count: 12},
        {id: 3, name: 'Season 3', episode_count: 8}
      ]
    }
    similarShows.value = mockSimilarShows
    await loadWatchProviders()
  } finally {
    isLoading.value = false
  }
}

const loadWatchProviders = async () => {
  isLoadingProviders.value = true
  
  try {
    const { getWatchProviders } = useApi()
    const response = await getWatchProviders(tvId, selectedCountry.value)
    
    if (response.success && response.data?.results) {
      const countryData = response.data.results[selectedCountry.value]
      if (countryData?.flatrate) {
        watchProviders.value = countryData.flatrate.map(provider => ({
          provider_id: provider.provider_id,
          provider_name: provider.provider_name,
          logo_path: provider.logo_path,
          display_priority: 1
        }))
      } else {
        watchProviders.value = []
      }
    }
    
  } catch (error) {
    console.error('Platform information loading error:', error)
    const { getMockWatchProviders } = useApi()
    const mockData = getMockWatchProviders(selectedCountry.value)
    watchProviders.value = mockData.providers.map(provider => ({
      provider_id: provider.provider_id,
      provider_name: provider.provider_name,
      display_priority: provider.display_priority
    }))
  } finally {
    isLoadingProviders.value = false
  }
}

const goToTV = (newTVId) => {
  navigateTo(`/tv/${newTVId}`)
}

const addToWatchlist = async () => {
  try {
    const { addToWatchlist: addToWatchlistApi } = useApi()
    await addToWatchlistApi(tvId, 'tv', 'to_watch')
    console.log('TV show added to watchlist!')
  } catch (error) {
    console.error('Add to watchlist error:', error)
  }
}

const rateTV = async (rating) => {
  try {
    const { rateMovie: rateTVApi } = useApi()
    await rateTVApi(tvId, rating)
    console.log(`TV show rated ${rating} stars!`)
  } catch (error) {
    console.error('Rating error:', error)
  }
}

onMounted(() => {
  loadTVDetail()
})

watchEffect(() => {
  if (route.params.id) {
    loadTVDetail()
  }
})

useHead({
  title: computed(() => tvDetail.value ? `${tvDetail.value.name} - Parotia` : 'TV Show Details - Parotia'),
  meta: [
    { name: 'description', content: computed(() => tvDetail.value?.overview || 'TV show details page') }
  ]
})
</script>