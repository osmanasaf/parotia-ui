import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', () => {
  // State
  const popularMovies = ref([])
  const popularTVShows = ref([])
  const recommendedMovies = ref([])
  const isLoading = ref(false)
  const recentSearches = ref([])

  // Getters
  const hasPopularMovies = computed(() => popularMovies.value.length > 0)
  const hasPopularTVShows = computed(() => popularTVShows.value.length > 0)
  const hasRecommendations = computed(() => recommendedMovies.value.length > 0)

  // Actions
  const setPopularMovies = (movies) => {
    popularMovies.value = movies
  }

  const setPopularTVShows = (shows) => {
    popularTVShows.value = shows
  }

  const setRecommendedMovies = (movies) => {
    recommendedMovies.value = movies
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const addRecentSearch = (search) => {
    const existingIndex = recentSearches.value.findIndex(s => s.id === search.id)
    if (existingIndex > -1) {
      recentSearches.value.splice(existingIndex, 1)
    }
    
    recentSearches.value.unshift(search)
    
    if (recentSearches.value.length > 10) {
      recentSearches.value = recentSearches.value.slice(0, 10)
    }
    
    sessionStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }

  const clearRecentSearches = () => {
    recentSearches.value = []
    sessionStorage.removeItem('recentSearches')
  }

  const loadRecentSearches = () => {
    try {
      const savedSearches = sessionStorage.getItem('recentSearches')
      if (savedSearches) {
        recentSearches.value = JSON.parse(savedSearches)
      }
    } catch (error) {
      console.error('Recent searches yüklenirken hata:', error)
    }
  }

  return {
    // State
    popularMovies,
    popularTVShows,
    recommendedMovies,
    isLoading,
    recentSearches,
    
    // Getters
    hasPopularMovies,
    hasPopularTVShows,
    hasRecommendations,
    
    // Actions
    setPopularMovies,
    setPopularTVShows,
    setRecommendedMovies,
    setLoading,
    addRecentSearch,
    clearRecentSearches,
    loadRecentSearches
  }
}) 