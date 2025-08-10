export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const headers = getHeaders(event)
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'

    const response = await $fetch(`${baseUrl}/tv/rate`, {
      method: 'POST',
      body,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        ...(headers.authorization ? { authorization: headers.authorization } : {})
      }
    })
    return response
  } catch (error) {
    console.error('TV rate API error:', error)
    throw createError({ statusCode: 500, statusMessage: 'TV rate failed' })
  }
})


