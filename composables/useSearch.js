export const useSearch = () => {
  const searchStore = useSearchStore()
  const contentStore = useContentStore()
  const { getWatchProviders } = useApi()

  const handleSearchInput = (query) => {
    searchStore.setExpandingSearchQuery(query)
    // Otomatik arama kaldırıldı - sadece Enter veya butona tıklayınca arama yapılacak
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
      console.log('selectSearchResult called with:', result)
      
      // API'den gelen veri yapısına göre ID'yi al - öncelik tmdb_id, yoksa id
      const contentId = result.tmdb_id ?? result.id
      console.log('Getting watch providers for contentId:', contentId, 'country:', searchStore.expandingSearchCountry)
      
      const response = await getWatchProviders(contentId, searchStore.expandingSearchCountry)
      console.log('Watch providers response:', response)
      
      if (response.success && response.data?.results) {
        const countryData = response.data.results[searchStore.expandingSearchCountry]
        console.log('Country data:', countryData)
        
        if (countryData?.flatrate) {
          const providers = countryData.flatrate.map(provider => ({
            id: provider.provider_id,
            name: provider.provider_name,
            color: '#E50914',
            logo: provider.logo_path
          }))
          console.log('Setting providers:', providers)
          searchStore.setSelectedExpandingSearchProviders(providers)
        } else {
          console.log('No flatrate providers found')
          searchStore.setSelectedExpandingSearchProviders([])
        }
      } else {
        console.log('No results in response')
        searchStore.setSelectedExpandingSearchProviders([])
      }
    } catch (error) {
      console.error('Provider bilgisi alınırken hata:', error)
      const fallbackProviders = getFallbackProviders(searchStore.expandingSearchCountry)
      searchStore.setSelectedExpandingSearchProviders(fallbackProviders)
    }
    
    // Recent search için veri yapısını düzelt
    const searchData = {
      id: result.tmdb_id ?? result.id,
      title: result.title,
      poster: result.poster_path,
      type: result.content_type,
      year: result.year
    }
    contentStore.addRecentSearch(searchData)
  }

  const selectRecentSearch = async (search) => {
    searchStore.setExpandingSearchQuery(search.title)
    // Recent search için veri yapısını düzelt
    const searchData = {
      tmdb_id: search.id, // selectSearchResult için tmdb_id bekleniyor
      id: search.id,
      title: search.title,
      poster_path: search.poster,
      content_type: search.type,
      year: search.year
    }
    await selectSearchResult(searchData)
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
    // Modal kapanma mantığı kaldırıldı - sadece ESC veya dışına tıklayınca kapanacak
  }

  const performSearchOnEnter = async () => {
    const query = searchStore.expandingSearchQuery.trim()
    if (query) {
      try {
        // Search endpoint'ine istek at
        const results = await useContent().searchContent(query, 1, 'all')
        
        console.log('Search results:', results) // Debug için
        
        searchStore.setExpandingSearchResults(results)
        
        // Eğer sonuç varsa ilkini seç
        if (results.length > 0) {
          await selectSearchResult(results[0])
        } else {
          // Sonuç yoksa kullanıcıya bilgi ver
          console.log('Arama sonucu bulunamadı')
        }
      } catch (error) {
        console.error('Search endpoint error:', error)
        searchStore.setExpandingSearchResults([])
      }
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