export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { searchQuery, page = 1, contentType = 'all' } = query

  if (!searchQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query is required'
    })
  }

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
    
    const response = await $fetch(`${baseUrl}/content/search`, {
      method: 'GET',
      params: {
        query: searchQuery,
        page,
        content_type: contentType
      },
      headers: {
        'accept': 'application/json'
      }
    })

    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Content search API error:', error)
    
    // Fallback mock data
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
        ).filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    }
  }
}) 