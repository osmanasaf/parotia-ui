export const useApi = () => {
  const config = useRuntimeConfig()
  const { getToken, isTokenValid } = useTokenManager()

  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
  const apiCall = async (endpoint, options = {}) => {
    const token = getToken?.() || null

    try {
      const response = await $fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && isTokenValid?.(token) ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })
      return response
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      if (error.statusCode === 401 && typeof window !== 'undefined') {
        try {
          localStorage.removeItem('access_token')
        } catch {
          /* noop */
        }
      }
      throw error
    }
  }
  const getHybridRecommendations = async (emotionText, contentType = 'all', page = 1) => {
    try {
      return await apiCall(`/recommendations/hybrid?page=${page}`, {
        method: 'POST',
        body: {
          emotion_text: emotionText,
          content_type: contentType,
          page
        }
      })
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          recommendations: getMockRecommendations(emotionText).recommendations.map(rec => ({
            tmdb_id: rec.tmdb_id,
            content_type: 'movie',
            recommendation_type: 'hybrid',
            score: rec.similarity_score,
            emotion_state: 'mock_emotion',
            tmdb_data: {
              id: rec.tmdb_id,
              title: rec.title,
              overview: rec.overview,
              poster_path: null,
              vote_average: rec.vote_average
            }
          }))
        }
      }
    }
  }

  const getEmotionRecommendations = async (emotionText, contentType = 'all', page = 1) => {
    try {
      return await apiCall(`/recommendations/current-emotion?page=${page}`, {
        method: 'POST',
        body: {
          emotion: emotionText,
          content_type: contentType,
          page
        }
      })
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          recommendations: getMockRecommendations(emotionText).recommendations.map(rec => ({
            tmdb_id: rec.tmdb_id,
            content_type: 'movie',
            recommendation_type: 'emotion_based',
            score: rec.similarity_score,
            emotion_state: 'mock_emotion',
            tmdb_data: {
              id: rec.tmdb_id,
              title: rec.title,
              overview: rec.overview,
              poster_path: null,
              vote_average: rec.vote_average
            }
          }))
        }
      }
    }
  }

  const getMovieDetail = async (tmdbId) => {
    try {
      return await apiCall(`/movies/${tmdbId}`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: getMockMovieDetail(tmdbId)
      }
    }
  }

  const getMovieDetailsWithSimilar = async (tmdbId) => {
    try {
      return await apiCall(`/movies/details-with-similar/${tmdbId}`)
    } catch (error) {
      return { success: false }
    }
  }

  const getMovieDetailsWithSimilarPublic = async (tmdbId) => {
    try {
      return await apiCall(`/movies/details-with-similar-public/${tmdbId}`)
    } catch (error) {
      return { success: false }
    }
  }

  const getMovieDetailsPublic = async (tmdbId) => {
    try {
      return await apiCall(`/movies/details-public/${tmdbId}`)
    } catch (error) {
      console.warn('API details-public failed:', error)
      return { success: false, data: getMockMovieDetail(tmdbId) }
    }
  }

  const getSimilarMoviesPublic = async (tmdbId) => {
    try {
      return await apiCall(`/movies/similar-public/${tmdbId}`)
    } catch (error) {
      console.warn('API similar-public failed:', error)
      return { success: false, data: [] }
    }
  }

  const getWatchProviders = async (tmdbId, country = 'TR') => {
    try {
      return await apiCall(`/movies/${tmdbId}/watch-providers`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          results: {
            [country]: {
              flatrate: getMockWatchProviders(country).providers.map(p => ({
                provider_id: p.provider_id,
                provider_name: p.provider_name,
                logo_path: `/logo_${p.provider_name.toLowerCase().replace(/\s+/g, '_')}.jpg`
              }))
            }
          }
        }
      }
    }
  }

  const getPopularMovies = async (page = 1) => {
    try {
      return await apiCall(`/movies/popular?page=${page}`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          page: 1,
          total_pages: 500,
          total_results: 10000,
          results: [
            { id: 550, title: "Fight Club", overview: "İsimsiz anlatıcı...", poster_path: null, release_date: "1999-10-15", vote_average: 8.8, vote_count: 22000, genre_ids: [18, 53] },
            { id: 680, title: "Pulp Fiction", overview: "Los Angeles'ta...", poster_path: null, release_date: "1994-10-14", vote_average: 8.9, vote_count: 25000, genre_ids: [80, 18] },
            { id: 13, title: "Forrest Gump", overview: "Forrest Gump...", poster_path: null, release_date: "1994-07-06", vote_average: 8.8, vote_count: 24000, genre_ids: [18, 35, 10749] },
            { id: 278, title: "The Shawshank Redemption", overview: "Andy Dufresne...", poster_path: null, release_date: "1994-09-23", vote_average: 9.3, vote_count: 26000, genre_ids: [18, 80] },
            { id: 238, title: "The Godfather", overview: "Don Vito Corleone...", poster_path: null, release_date: "1972-03-24", vote_average: 9.2, vote_count: 18000, genre_ids: [18, 80] }
          ]
        }
      }
    }
  }

  const loginUser = async (email, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.access_token && process.client) {
        localStorage.setItem('movai_token', response.access_token)
      }

      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const registerUser = async (email, username, password) => {
    try {
      return await apiCall('/auth/register', {
        method: 'POST',
        body: { email, username, password }
      })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const getCurrentUser = async () => {
    try {
      return await apiCall('/auth/me')
    } catch (error) {
      if (process.client) {
        localStorage.removeItem('movai_token')
      }
      throw error
    }
  }

  const searchMovies = async (query, page = 1) => {
    try {
      return await apiCall(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          page: 1,
          total_pages: 1,
          total_results: 3,
          results: [
            { id: 1, title: "The Shawshank Redemption", overview: "İki kişi...", poster_path: null, release_date: "1994-09-23", vote_average: 9.3 },
            { id: 2, title: "The Godfather", overview: "Güçlü bir aile...", poster_path: null, release_date: "1972-03-24", vote_average: 9.2 },
            { id: 3, title: "The Dark Knight", overview: "Batman...", poster_path: null, release_date: "2008-07-18", vote_average: 9.0 }
          ]
        }
      }
    }
  }

  const searchContent = async (query, page = 1, contentType = 'all') => {
    try {
      return await apiCall(`/content/search?query=${encodeURIComponent(query)}&page=${page}&content_type=${contentType}`)
    } catch (error) {
      console.warn('Content search API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          page: 1,
          total_pages: 1,
          total_results: 5,
          results: [
            {
              id: 1,
              title: "Inception",
              name: "Inception",
              overview: "Rüya içinde rüya konseptini işleyen bilim kurgu filmi...",
              poster_path: null,
              release_date: "2010-07-16",
              first_air_date: "2010-07-16",
              vote_average: 8.8,
              media_type: "movie"
            },
            {
              id: 2,
              title: "Breaking Bad",
              name: "Breaking Bad",
              overview: "Kimya öğretmeni Walter White'ın suç dünyasına girişi...",
              poster_path: null,
              first_air_date: "2008-01-20",
              vote_average: 9.5,
              media_type: "tv"
            },
            {
              id: 3,
              title: "The Dark Knight",
              name: "The Dark Knight",
              overview: "Batman'in Joker ile mücadelesi...",
              poster_path: null,
              release_date: "2008-07-18",
              vote_average: 9.0,
              media_type: "movie"
            },
            {
              id: 4,
              title: "Stranger Things",
              name: "Stranger Things",
              overview: "Hawkins kasabasında garip olaylar...",
              poster_path: null,
              first_air_date: "2016-07-15",
              vote_average: 8.7,
              media_type: "tv"
            },
            {
              id: 5,
              title: "The Shawshank Redemption",
              name: "The Shawshank Redemption",
              overview: "Umut ve dostluk hakkında güçlü bir hikaye...",
              poster_path: null,
              release_date: "1994-09-23",
              vote_average: 9.3,
              media_type: "movie"
            }
          ].filter(item =>
            contentType === 'all' || item.media_type === contentType
          )
        }
      }
    }
  }

  const rateMovie = async (tmdbId, rating, comment = null) => {
    try {
      return await apiCall('/movies/rate', {
        method: 'POST',
        body: {
          tmdb_id: tmdbId,
          content_type: 'movie',
          rating,
          comment
        }
      })
    } catch (error) {
      console.error('Rating failed:', error)
      throw error
    }
  }

  const addToWatchlist = async (tmdbId, contentType = 'movie', status = 'to_watch') => {
    try {
      return await apiCall('/movies/watchlist', {
        method: 'POST',
        body: {
          tmdb_id: tmdbId,
          content_type: contentType,
          status
        }
      })
    } catch (error) {
      console.error('Add to watchlist failed:', error)
      throw error
    }
  }

  const selectRecommendation = async (tmdbId, contentType, recommendationType, source, score, rank) => {
    try {
      return await apiCall('/recommendations/select', {
        method: 'POST',
        body: {
          tmdb_id: tmdbId,
          content_type: contentType,
          recommendation_type: recommendationType,
          source,
          recommendation_score: score,
          selected_rank: rank
        }
      })
    } catch (error) {
      console.warn('Seçim kaydedilemedi:', error)
      throw error
    }
  }

  // Forgot password
  const requestPasswordReset = async (email) => {
    try {
      return await apiCall('/auth/request-password-reset', {
        method: 'POST',
        body: { email }
      })
    } catch (error) {
      console.error('Forgot password failed:', error)
      throw error
    }
  }

  const resetPassword = async (email, code, newPassword) => {
    try {
      return await apiCall('/auth/confirm-password-reset', {
        method: 'POST',
        body: { email, code, new_password: newPassword }
      })
    } catch (error) {
      console.error('Reset password failed:', error)
      throw error
    }
  }
  const getMockRecommendations = (emotionText) => {
    return {
      recommendations: [
        {
          tmdb_id: 101,
          title: `${emotionText} için Film 1`,
          overview: 'Bu film sizin duygusal ihtiyaçlarınıza uygun olarak seçildi.',
          vote_average: 8.2,
          release_date: '2024-01-15',
          genre_names: ['Drama', 'Komedi'],
          similarity_score: 0.92
        },
        {
          tmdb_id: 102,
          title: `${emotionText} için Film 2`,
          overview: 'Ruh halinizi yansıtan mükemmel bir yapım.',
          vote_average: 7.8,
          release_date: '2023-11-20',
          genre_names: ['Aksiyon', 'Gerilim'],
          similarity_score: 0.88
        },
        {
          tmdb_id: 103,
          title: `${emotionText} için Film 3`,
          overview: 'Duygusal atmosferin tam karşılığı.',
          vote_average: 8.5,
          release_date: '2024-03-10',
          genre_names: ['Romantik', 'Drama'],
          similarity_score: 0.85
        },
        {
          tmdb_id: 104,
          title: `${emotionText} için Film 4`,
          overview: 'Şu anki ruh haliniz için ideal seçim.',
          vote_average: 7.6,
          release_date: '2024-02-28',
          genre_names: ['Bilim Kurgu', 'Macera'],
          similarity_score: 0.83
        }
      ],
      recommendation_type: 'emotion_based',
      user_emotion: emotionText,
      total_recommendations: 4
    }
  }

  const getMockMovieDetail = (tmdbId) => {
    return {
      tmdb_id: parseInt(tmdbId),
      title: `Harika Film ${tmdbId}`,
      overview: 'Bu muhteşem film, izleyiciyi büyüleyici bir hikaye ile karşılıyor. Mükemmel oyunculuk, etkileyici görsel efektler ve güçlü senaryo ile dolu dolu bir sinema deneyimi sunuyor.',
      vote_average: 8.1,
      release_date: '2024-01-15',
      runtime: 148,
      genre_names: ['Aksiyon', 'Drama', 'Gerilim'],
      director: 'Ünlü Yönetmen',
      cast: ['Başrol Oyuncusu 1', 'Başrol Oyuncusu 2', 'Ünlü Oyuncu 3'],
      poster_path: null,
      backdrop_path: null,
      production_companies: ['Warner Bros', 'Universal Pictures'],
      original_language: 'en',
      budget: 150000000,
      revenue: 890000000
    }
  }

  const getMockWatchProviders = (country = 'TR') => {
    const providers = {
      'TR': [
        { provider_id: 8, provider_name: 'Netflix', display_priority: 1 },
        { provider_id: 119, provider_name: 'Amazon Prime Video', display_priority: 2 },
        { provider_id: 337, provider_name: 'Disney+', display_priority: 3 },
        { provider_id: 441, provider_name: 'BluTV', display_priority: 4 },
        { provider_id: 564, provider_name: 'EXXEN', display_priority: 5 },
        { provider_id: 423, provider_name: 'Gain', display_priority: 6 }
      ],
      'US': [
        { provider_id: 8, provider_name: 'Netflix', display_priority: 1 },
        { provider_id: 119, provider_name: 'Amazon Prime Video', display_priority: 2 },
        { provider_id: 337, provider_name: 'Disney+', display_priority: 3 },
        { provider_id: 387, provider_name: 'HBO Max', display_priority: 4 },
        { provider_id: 15, provider_name: 'Hulu', display_priority: 5 }
      ]
    }

    return {
      country_code: country,
      providers: providers[country] || providers['TR']
    }
  }

  const getPopularTVShows = async (page = 1) => {
    try {
      return await apiCall(`/tv/popular?page=${page}`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          page: 1,
          total_pages: 500,
          total_results: 10000,
          results: [
            { id: 1399, name: "Game of Thrones", overview: "Yedi krallık...", poster_path: null, first_air_date: "2011-04-17", vote_average: 9.2, vote_count: 15000, genre_ids: [18, 10765] },
            { id: 94605, name: "Arcane", overview: "Jinx ve Vi'nin hikayesi...", poster_path: null, first_air_date: "2021-11-06", vote_average: 9.0, vote_count: 8000, genre_ids: [16, 10765] },
            { id: 85271, name: "WandaVision", overview: "Wanda ve Vision...", poster_path: null, first_air_date: "2021-01-15", vote_average: 8.4, vote_count: 12000, genre_ids: [10765, 9648] },
            { id: 71712, name: "The Good Place", overview: "Eleanor'un ölümden sonraki yaşamı...", poster_path: null, first_air_date: "2016-09-19", vote_average: 8.2, vote_count: 6000, genre_ids: [35, 10765] },
            { id: 66732, name: "Stranger Things", overview: "Hawkins kasabasında...", poster_path: null, first_air_date: "2016-07-15", vote_average: 8.7, vote_count: 14000, genre_ids: [18, 10765] }
          ]
        }
      }
    }
  }

  const getTVDetail = async (tmdbId) => {
    try {
      return await apiCall(`/tv/${tmdbId}`)
    } catch (error) {
      console.warn('API çağrısı başarısız, mock data kullanılıyor:', error)
      return {
        success: true,
        data: {
          id: tmdbId,
          name: `Harika Dizi ${tmdbId}`,
          overview: 'Bu muhteşem dizi, izleyiciyi büyüleyici bir hikaye ile karşılıyor. Mükemmel oyunculuk, etkileyici görsel efektler ve güçlü senaryo ile dolu dolu bir dizi deneyimi sunuyor.',
          vote_average: 8.5,
          first_air_date: '2024-01-15',
          last_air_date: '2024-12-15',
          number_of_seasons: 3,
          number_of_episodes: 30,
          genres: [
            { id: 18, name: "Drama" },
            { id: 10765, name: "Sci-Fi & Fantasy" }
          ],
          poster_path: null,
          backdrop_path: null,
          cast: [],
          crew: [],
          seasons: []
        }
      }
    }
  }

  const getTVDetailsWithSimilar = async (tmdbId) => {
    try {
      return await apiCall(`/tv/details-with-similar/${tmdbId}`)
    } catch (error) {
      return { success: false }
    }
  }

  const getTVDetailsWithSimilarPublic = async (tmdbId) => {
    try {
      return await apiCall(`/tv/details-with-similar-public/${tmdbId}`)
    } catch (error) {
      return { success: false }
    }
  }

  return {
    getHybridRecommendations,
    getEmotionRecommendations,
    getMovieDetail,
    getMovieDetailsPublic,
    getSimilarMoviesPublic,
    getMovieDetailsWithSimilar,
    getMovieDetailsWithSimilarPublic,
    getTVDetail,
    getTVDetailsWithSimilar,
    getTVDetailsWithSimilarPublic,
    getWatchProviders,
    getPopularMovies,
    getPopularTVShows,
    searchMovies,
    searchContent,
    loginUser,
    registerUser,
    getCurrentUser,
    rateMovie,
    addToWatchlist,
    selectRecommendation,
    getMockRecommendations,
    getMockMovieDetail,
    getMockWatchProviders,
    requestPasswordReset,
    resetPassword
  }
}

export const useAuth = () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  const login = async (email, password) => {
    try {
      const { loginUser, getCurrentUser } = useApi()
      const response = await loginUser(email, password)

      if (response.access_token) {
        const userInfo = await getCurrentUser()
        user.value = userInfo
        return { success: true, user: userInfo }
      }

      return { success: false, error: 'Token alınamadı' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('movai_token')
    }
    user.value = null
    navigateTo('/')
  }

  const register = async (email, username, password) => {
    try {
      const { registerUser } = useApi()
      const response = await registerUser(email, username, password)
      return { success: true, user: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout,
    register
  }
}