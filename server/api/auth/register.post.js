export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, username, password } = body

    // Validasyon
    if (!email || !username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, kullanıcı adı ve şifre gereklidir'
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

    // Şifre güvenliği kontrolü
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Şifre en az 8 karakter olmalıdır'
      })
    }

    // Mock kullanıcı oluşturma (gerçek uygulamada veritabanına kaydedilir)
    const mockUser = {
      id: Date.now(),
      email,
      username,
      is_active: true,
      is_verified: false,
      created_at: new Date().toISOString()
    }

    // Email doğrulama kodu oluştur (gerçek uygulamada email gönderilir)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    return {
      success: true,
      user: mockUser,
      message: 'Kullanıcı başarıyla oluşturuldu. Email doğrulama kodu gönderildi.',
      verification_code: verificationCode // Development için
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Sunucu hatası'
    })
  }
}) 