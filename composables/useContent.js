export const useContent = () => {
  const contentStore = useContentStore()

  const loadPopularMovies = async (page = 1) => {
    try {
      console.log('Loading popular movies...')
      const response = await $fetch('/api/content/popular-movies', {
        params: { page }
      })
      
      console.log('Full API response:', response)
      console.log('Response data:', response.data)
      
      // Backend'den gelen veri yapısını kontrol et
      if (response.data?.results && Array.isArray(response.data.results)) {
        // results array'i varsa kullan
        const movies = response.data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          overview: movie.overview,
          rating: movie.vote_average,
          release_date: movie.release_date
        }))
        console.log('Processed movies from results:', movies)
        contentStore.setPopularMovies(movies)
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Tek obje ise array'e çevir
        const movie = {
          id: response.data.id,
          title: response.data.title,
          poster: response.data.poster_path,
          overview: response.data.overview,
          rating: response.data.vote_average,
          release_date: response.data.release_date
        }
        console.log('Processed single movie:', movie)
        contentStore.setPopularMovies([movie])
      } else if (Array.isArray(response.data)) {
        // Array ise direkt kullan
        const movies = response.data.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          overview: movie.overview,
          rating: movie.vote_average,
          release_date: movie.release_date
        }))
        console.log('Processed movies array:', movies)
        contentStore.setPopularMovies(movies)
      } else {
        console.log('No valid data found')
      }
    } catch (error) {
      console.error('Popular movies yüklenirken hata:', error)
    }
  }

  const loadPopularTVShows = async (page = 1) => {
    try {
      console.log('Loading popular TV shows...')
      const response = await $fetch('/api/content/popular-tv', {
        params: { page }
      })
      
      console.log('Full TV API response:', response)
      console.log('TV Response data:', response.data)
      
      // Backend'den gelen veri yapısını kontrol et
      if (response.data?.results && Array.isArray(response.data.results)) {
        // results array'i varsa kullan
        const shows = response.data.results.map(show => ({
          id: show.id,
          name: show.name,
          poster: show.poster_path,
          overview: show.overview,
          rating: show.vote_average,
          first_air_date: show.first_air_date
        }))
        console.log('Processed TV shows from results:', shows)
        contentStore.setPopularTVShows(shows)
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Tek obje ise array'e çevir
        const show = {
          id: response.data.id,
          name: response.data.name,
          poster: response.data.poster_path,
          overview: response.data.overview,
          rating: response.data.vote_average,
          first_air_date: response.data.first_air_date
        }
        console.log('Processed single TV show:', show)
        contentStore.setPopularTVShows([show])
      } else if (Array.isArray(response.data)) {
        // Array ise direkt kullan
        const shows = response.data.map(show => ({
          id: show.id,
          name: show.name,
          poster: show.poster_path,
          overview: show.overview,
          rating: show.vote_average,
          first_air_date: show.first_air_date
        }))
        console.log('Processed TV shows array:', shows)
        contentStore.setPopularTVShows(shows)
      } else {
        console.log('No valid TV data found')
      }
    } catch (error) {
      console.error('Popular TV shows yüklenirken hata:', error)
    }
  }

  const searchContent = async (query, page = 1, contentType = 'all') => {
    try {
      const { data } = await $fetch('/api/content/search', {
        params: { searchQuery: query, page, contentType }
      })
      
      if (data?.results) {
        return data.results.map(item => ({
          id: item.id,
          title: item.title || item.name,
          year: item.release_date ? new Date(item.release_date).getFullYear() : 
                item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
          type: item.media_type === 'movie' ? 'Movie' : 'TV Series',
          poster: item.poster_path,
          overview: item.overview,
          vote_average: item.vote_average,
          media_type: item.media_type
        }))
      }
      return []
    } catch (error) {
      console.error('Content search error:', error)
      return []
    }
  }

  const getRecommendations = async (emotionInput) => {
    if (!emotionInput.trim()) return []
    
    contentStore.setLoading(true)
    
    try {
      const { getHybridRecommendations, getEmotionRecommendations } = useApi()
      const { isLoggedIn } = useAuth()
      
      let response
      if (isLoggedIn.value) {
        response = await getHybridRecommendations(emotionInput)
      } else {
        response = await getEmotionRecommendations(emotionInput)
      }
      
      if (response.success && response.data?.recommendations) {
        const recommendations = response.data.recommendations.map(rec => ({
          tmdb_id: rec.tmdb_data.id,
          title: rec.tmdb_data.title || rec.tmdb_data.name,
          vote_average: rec.tmdb_data.vote_average,
          overview: rec.tmdb_data.overview,
          poster: rec.tmdb_data.poster_path,
          score: rec.score,
          emotion_state: rec.emotion_state
        }))
        contentStore.setRecommendedMovies(recommendations)
        return recommendations
      }
      return []
    } catch (error) {
      console.error('Öneri alma hatası:', error)
      const { getMockRecommendations } = useApi()
      const mockResponse = getMockRecommendations(emotionInput)
      const recommendations = mockResponse.recommendations.map(rec => ({
        tmdb_id: rec.tmdb_id,
        title: rec.title,
        vote_average: rec.vote_average,
        overview: rec.overview,
        genre_names: rec.genre_names
      }))
      contentStore.setRecommendedMovies(recommendations)
      return recommendations
    } finally {
      contentStore.setLoading(false)
    }
  }

  const navigateToContent = (content) => {
    if (typeof content === 'object' && content.media_type === 'tv') {
      navigateTo(`/tv/${content.id}`)
    } else if (typeof content === 'object' && content.type === 'TV Series') {
      navigateTo(`/tv/${content.id}`)
    } else if (typeof content === 'object' && content.name) {
      navigateTo(`/tv/${content.id}`)
    } else {
      const contentId = typeof content === 'object' ? content.id : content
      navigateTo(`/movie/${contentId}`)
    }
  }

  return {
    loadPopularMovies,
    loadPopularTVShows,
    searchContent,
    getRecommendations,
    navigateToContent
  }
} 