import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
  // State
  const isExpandingSearchExpanded = ref(false)
  const expandingSearchQuery = ref('')
  const expandingSearchCountry = ref('TR')
  const showExpandingSearchDropdown = ref(false)
  const expandingSearchResults = ref([])
  const selectedExpandingSearchProviders = ref([])
  const expandingSearchTimeout = ref(null)

  // Getters
  const hasSearchResults = computed(() => expandingSearchResults.value.length > 0)
  const hasProviders = computed(() => selectedExpandingSearchProviders.value.length > 0)
  const isSearchActive = computed(() => expandingSearchQuery.value.trim().length > 0)

  // Actions
  const toggleExpandingSearch = () => {
    isExpandingSearchExpanded.value = !isExpandingSearchExpanded.value
    if (isExpandingSearchExpanded.value) {
      showExpandingSearchDropdown.value = true
    } else {
      showExpandingSearchDropdown.value = false
      expandingSearchQuery.value = ''
      expandingSearchResults.value = []
      selectedExpandingSearchProviders.value = []
    }
  }

  const setExpandingSearchQuery = (query) => {
    expandingSearchQuery.value = query
  }

  const setExpandingSearchCountry = (country) => {
    expandingSearchCountry.value = country
  }

  const setShowExpandingSearchDropdown = (show) => {
    showExpandingSearchDropdown.value = show
  }

  const setExpandingSearchResults = (results) => {
    expandingSearchResults.value = results
  }

  const setSelectedExpandingSearchProviders = (providers) => {
    selectedExpandingSearchProviders.value = providers
  }

  const setExpandingSearchTimeout = (timeout) => {
    expandingSearchTimeout.value = timeout
  }

  const clearSearchResults = () => {
    expandingSearchResults.value = []
    selectedExpandingSearchProviders.value = []
  }

  const resetSearch = () => {
    expandingSearchQuery.value = ''
    expandingSearchResults.value = []
    selectedExpandingSearchProviders.value = []
    showExpandingSearchDropdown.value = false
    isExpandingSearchExpanded.value = false
  }

  return {
    // State
    isExpandingSearchExpanded,
    expandingSearchQuery,
    expandingSearchCountry,
    showExpandingSearchDropdown,
    expandingSearchResults,
    selectedExpandingSearchProviders,
    expandingSearchTimeout,
    
    // Getters
    hasSearchResults,
    hasProviders,
    isSearchActive,
    
    // Actions
    toggleExpandingSearch,
    setExpandingSearchQuery,
    setExpandingSearchCountry,
    setShowExpandingSearchDropdown,
    setExpandingSearchResults,
    setSelectedExpandingSearchProviders,
    setExpandingSearchTimeout,
    clearSearchResults,
    resetSearch
  }
}) 