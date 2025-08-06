export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, code } = body

    if (!email || !code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email ve doğrulama kodu gereklidir'
      })
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçerli bir email adresi girin'
      })
    }

    // Doğrulama kodu formatı kontrolü
    if (!/^\d{6}$/.test(code)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Doğrulama kodu 6 haneli olmalıdır'
      })
    }

    // Mock doğrulama kontrolü (gerçek uygulamada veritabanından kontrol edilir)
    // Development için herhangi bir 6 haneli kod kabul ediyoruz
    const isValidCode = /^\d{6}$/.test(code)

    if (!isValidCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçersiz doğrulama kodu'
      })
    }

    // Mock kullanıcı güncelleme (gerçek uygulamada veritabanı güncellenir)
    const updatedUser = {
      id: 1,
      email,
      username: email.split('@')[0],
      is_active: true,
      is_verified: true,
      created_at: '2024-01-01T10:00:00Z'
    }

    return {
      success: true,
      message: 'Email adresiniz başarıyla doğrulandı!',
      user: updatedUser
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Sunucu hatası'
    })
  }
}) 