export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event)
    const authHeader = headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Yetkilendirme token\'ı gereklidir'
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Mock token kontrolü (gerçek uygulamada JWT decode edilir)
    if (!token.includes('mock_signature')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Geçersiz token'
      })
    }

    // Mock kullanıcı bilgileri (gerçek uygulamada token'dan çıkarılır)
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      is_active: true,
      is_verified: true,
      created_at: '2024-01-01T10:00:00Z'
    }

    return {
      success: true,
      user: mockUser
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Sunucu hatası'
    })
  }
}) 