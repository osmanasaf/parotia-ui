export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
    const headers = getHeaders(event)

    const response = await $fetch(`${baseUrl}/tv/my/watchlist`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(headers.authorization ? { authorization: headers.authorization } : {})
      }
    })

    return { success: true, data: response.data || response }
  } catch (error) {
    console.error('TV watchlist fetch error:', error)
    return { success: true, data: [] }
  }
})


