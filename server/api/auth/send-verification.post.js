export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email adresi gereklidir'
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

    // Mock doğrulama kodu oluştur
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Gerçek uygulamada bu kod email ile gönderilir
    // Şimdilik development için console'da gösteriyoruz
    console.log(`Doğrulama kodu ${email} adresine gönderildi: ${verificationCode}`)

    return {
      success: true,
      message: 'Doğrulama kodu email adresinize gönderildi',
      verification_code: verificationCode // Development için
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Sunucu hatası'
    })
  }
}) 