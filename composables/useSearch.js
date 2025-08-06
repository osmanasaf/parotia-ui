export const useSearch = () => {
  const searchStore = useSearchStore()
  const contentStore = useContentStore()
  const { getWatchProviders } = useApi()

  const handleSearchInput = (query) => {
    searchStore.setExpandingSearchQuery(query)
    
    if (searchStore.expandingSearchTimeout) {
      clearTimeout(searchStore.expandingSearchTimeout)
    }
    
    if (query.trim()) {
      const timeout = setTimeout(() => {
        performSearch(query)
      }, 300)
      searchStore.setExpandingSearchTimeout(timeout)
    } else {
      searchStore.clearSearchResults()
    }
  }

  const performSearch = async (query) => {
    if (!query.trim()) return
    
    try {
      const results = await useContent().searchContent(query, 1, 'all')
      searchStore.setExpandingSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      searchStore.setExpandingSearchResults([])
    }
  }

  const selectSearchResult = async (result) => {
    try {
      const response = await getWatchProviders(result.id, searchStore.expandingSearchCountry)
      
      if (response.success && response.data?.results) {
        const countryData = response.data.results[searchStore.expandingSearchCountry]
        if (countryData?.flatrate) {
          const providers = countryData.flatrate.map(provider => ({
            id: provider.provider_id,
            name: provider.provider_name,
            color: '#E50914',
            logo: provider.logo_path
          }))
          searchStore.setSelectedExpandingSearchProviders(providers)
        } else {
          searchStore.setSelectedExpandingSearchProviders([])
        }
      }
    } catch (error) {
      console.error('Provider bilgisi alınırken hata:', error)
      const fallbackProviders = getFallbackProviders(searchStore.expandingSearchCountry)
      searchStore.setSelectedExpandingSearchProviders(fallbackProviders)
    }
    
    contentStore.addRecentSearch(result)
  }

  const selectRecentSearch = async (search) => {
    searchStore.setExpandingSearchQuery(search.title)
    await selectSearchResult(search)
  }

  const toggleSearch = () => {
    searchStore.toggleExpandingSearch()
  }

  const setSearchCountry = (country) => {
    searchStore.setExpandingSearchCountry(country)
  }

  const clearRecentSearches = () => {
    contentStore.clearRecentSearches()
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      if (!searchStore.isExpandingSearchExpanded) {
        searchStore.setShowExpandingSearchDropdown(false)
      }
    }, 200)
  }

  const performSearchOnEnter = () => {
    if (searchStore.expandingSearchQuery.trim() && searchStore.expandingSearchResults.length > 0) {
      selectSearchResult(searchStore.expandingSearchResults[0])
    }
  }

  const getFallbackProviders = (country) => {
    const providersByCountry = {
      'TR': [
        { id: 1, name: 'Netflix', color: '#E50914' },
        { id: 2, name: 'Amazon Prime', color: '#00A8E1' },
        { id: 3, name: 'BluTV', color: '#1E3A8A' },
        { id: 4, name: 'EXXEN', color: '#10B981' }
      ],
      'US': [
        { id: 1, name: 'Netflix', color: '#E50914' },
        { id: 2, name: 'Amazon Prime', color: '#00A8E1' },
        { id: 3, name: 'Disney+', color: '#113CCF' },
        { id: 4, name: 'HBO Max', color: '#8B5CF6' },
        { id: 5, name: 'Hulu', color: '#1CE783' }
      ]
    }
    
    return providersByCountry[country] || providersByCountry['TR']
  }

  return {
    handleSearchInput,
    performSearch,
    selectSearchResult,
    selectRecentSearch,
    toggleSearch,
    setSearchCountry,
    clearRecentSearches,
    handleSearchBlur,
    performSearchOnEnter
  }
} 