// Mock API endpoint - geçici olarak devre dışı
export default defineEventHandler(async (event) => {
  // Gerçek backend'e yönlendir
  throw createError({
    statusCode: 404,
    statusMessage: 'Mock endpoint disabled - use real backend'
  })
  
  // Eski mock kod:
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validasyon
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email ve şifre gereklidir'
      })
    }

    // Mock kullanıcı kontrolü (gerçek uygulamada veritabanından kontrol edilir)
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      is_active: true,
      is_verified: true
    }

    // Email kontrolü
    if (email !== mockUser.email) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email veya şifre hatalı'
      })
    }

    // Şifre kontrolü (gerçek uygulamada hash karşılaştırması yapılır)
    if (password !== 'TestPass123') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email veya şifre hatalı'
      })
    }

    // Email doğrulama kontrolü
    if (!mockUser.is_verified) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Lütfen önce email adresinizi doğrulayın'
      })
    }

    // Kullanıcı aktif mi kontrolü
    if (!mockUser.is_active) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hesabınız aktif değil'
      })
    }

    // JWT token oluştur (gerçek uygulamada JWT kullanılır)
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzA0MDAwMDAwLCJleHAiOjE3MDQwODY0MDB9.mock_signature`

    return {
      success: true,
      access_token: mockToken,
      token_type: 'bearer',
      user: mockUser
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Sunucu hatası'
    })
  }
}) 