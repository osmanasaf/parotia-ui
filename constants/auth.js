// Authentication sabitleri
export const AUTH_CONSTANTS = {
  // Token yönetimi
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // Form validasyonu
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  
  // API endpoint'leri
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    SEND_VERIFICATION: '/auth/send-verification',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh'
  },
  
  // Hata mesajları
  ERROR_MESSAGES: {
    EMAIL_REQUIRED: 'Email adresi gereklidir',
    EMAIL_INVALID: 'Geçerli bir email adresi girin',
    PASSWORD_REQUIRED: 'Şifre gereklidir',
    PASSWORD_TOO_SHORT: 'Şifre en az 8 karakter olmalıdır',
    PASSWORD_WEAK: 'Şifre büyük/küçük harf ve rakam içermelidir',
    USERNAME_REQUIRED: 'Kullanıcı adı gereklidir',
    USERNAME_TOO_SHORT: 'Kullanıcı adı en az 3 karakter olmalıdır',
    USERNAME_TOO_LONG: 'Kullanıcı adı en fazla 30 karakter olabilir',
    PASSWORDS_DONT_MATCH: 'Şifreler eşleşmiyor',
    NETWORK_ERROR: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin',
    INVALID_CREDENTIALS: 'Email veya şifre hatalı',
    EMAIL_NOT_VERIFIED: 'Lütfen önce email adresinizi doğrulayın',
    USER_INACTIVE: 'Hesabınız aktif değil',
    EMAIL_ALREADY_EXISTS: 'Bu email adresi zaten kayıtlı'
  },
  
  // Başarı mesajları
  SUCCESS_MESSAGES: {
    REGISTER_SUCCESS: 'Hesabınız başarıyla oluşturuldu. Email doğrulama kodu gönderildi.',
    LOGIN_SUCCESS: 'Giriş başarılı!',
    LOGOUT_SUCCESS: 'Çıkış yapıldı',
    EMAIL_VERIFIED: 'Email adresiniz başarıyla doğrulandı!',
    VERIFICATION_SENT: 'Doğrulama kodu email adresinize gönderildi'
  }
}

// Form validasyon kuralları
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_INVALID
  },
  password: {
    required: true,
    minLength: AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
    // Sadece minimum uzunluk, büyük/küçük harf ve rakam kontrolü
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_WEAK
  },
  username: {
    required: true,
    minLength: AUTH_CONSTANTS.USERNAME_MIN_LENGTH,
    maxLength: AUTH_CONSTANTS.USERNAME_MAX_LENGTH,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'
  }
} 