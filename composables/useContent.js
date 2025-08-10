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
      const response = await $fetch('/api/content/search', {
        params: { searchQuery: query, page, contentType }
      })
      
      console.log('Search API response:', response)
      
      // API'den gelen veri yapısı: response.data.data
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map(item => ({
          tmdb_id: item.tmdb_id,
          title: item.title,
          year: item.year,
          content_type: item.content_type,
          poster_path: item.poster_path,
          overview: item.overview,
          vote_average: item.vote_average
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

  const loadGenresWithContent = async (contentType = 'movie') => {
    try {
      const response = await $fetch('/api/content/genres-with-content', {
        params: { content_type: contentType }
      })

      // Beklenen yapı: { success, data: { sections: [...] } }
      const sections = response?.data?.data?.sections || response?.data?.sections || []
      contentStore.setGenreSections(contentType, sections)
      return sections
    } catch (error) {
      console.error('Genres with content yüklenirken hata:', error)
      contentStore.setGenreSections(contentType, [])
      return []
    }
  }

  const loadMyWatchlist = async () => {
    try {
      const { getAuthHeaders } = useTokenManager()
      const authHeaders = getAuthHeaders()
      const fetchOpts = Object.keys(authHeaders).length ? { headers: authHeaders } : {}
      const [moviesRes, tvRes] = await Promise.all([
        $fetch('/api/movies/my/watchlist', fetchOpts),
        $fetch('/api/tv/my/watchlist', fetchOpts)
      ])

      const movieEntries = moviesRes?.data || moviesRes || []
      const tvEntries = tvRes?.data || tvRes || []

      // Watchlist sadece tmdb_id döndürüyor; detayları TMDB proxy'lerinden çekelim
      const { getMovieDetail, getTVDetail } = useApi()

      const movies = await Promise.all(
        (movieEntries || []).map(async (entry) => {
          try {
            const detail = await getMovieDetail(entry.tmdb_id)
            const d = detail?.data || detail
            return {
              id: d.id,
              title: d.title,
              poster_path: d.poster_path,
              overview: d.overview,
              vote_average: d.vote_average,
              year: (d.release_date || '').slice(0, 4) || '',
              status: entry.status || 'to_watch',
              contentType: 'movie',
              user_rating: entry.user_rating ?? null,
              user_comment: entry.user_comment ?? ''
            }
          } catch {
            return { id: entry.tmdb_id, title: `#${entry.tmdb_id}`, poster_path: null, overview: '', vote_average: null, year: '', status: entry.status || 'to_watch', contentType: 'movie' }
          }
        })
      )

      const tv = await Promise.all(
        (tvEntries || []).map(async (entry) => {
          try {
            const detail = await getTVDetail(entry.tmdb_id)
            const d = detail?.data || detail
            return {
              id: d.id,
              name: d.name,
              title: d.name,
              poster_path: d.poster_path,
              overview: d.overview,
              vote_average: d.vote_average,
              year: (d.first_air_date || '').slice(0, 4) || '',
              status: entry.status || 'to_watch',
              contentType: 'tv',
              user_rating: entry.user_rating ?? null,
              user_comment: entry.user_comment ?? ''
            }
          } catch {
            return { id: entry.tmdb_id, title: `#${entry.tmdb_id}`, poster_path: null, overview: '', vote_average: null, year: '', status: entry.status || 'to_watch', contentType: 'tv' }
          }
        })
      )

      const items = [...movies, ...tv]
      return { movies, tv, items }
    } catch (error) {
      console.error('Watchlist yüklenemedi:', error)
      return { movies: [], tv: [], items: [] }
    }
  }

  const rateContent = async ({ tmdbId, contentType = 'movie', rating, comment }) => {
    try {
      const endpoint = contentType === 'tv' ? '/tv/rate' : '/movies/rate'
      const { getAuthHeaders } = useTokenManager()
      return await $fetch(`/api${endpoint}`, {
        method: 'POST',
        body: { tmdb_id: tmdbId, content_type: contentType, rating, comment },
        headers: getAuthHeaders()
      })
    } catch (error) {
      console.error('Puanlama hatası:', error)
      throw error
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
    loadGenresWithContent,
    loadMyWatchlist,
    rateContent,
    searchContent,
    getRecommendations,
    navigateToContent
  }
} 