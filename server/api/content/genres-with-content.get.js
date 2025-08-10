export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { content_type = 'movie' } = query

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'

    const response = await $fetch(`${baseUrl}/content/genres-with-content`, {
      method: 'GET',
      params: { content_type },
      headers: { accept: 'application/json' }
    })

    return {
      success: true,
      data: response.data || response
    }
  } catch (error) {
    console.error('Genres with content API error:', error)
    return {
      success: true,
      data: {
        genres: [],
        popularGenres: [],
        sections: []
      }
    }
  }
})


