// Authentication constants
export const AUTH_CONSTANTS = {
  // Token management
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // Form validation
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  
  // API endpoints
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    SEND_VERIFICATION: '/auth/send-verification',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_EMAIL_CHANGE: '/auth/request-email-change',
    CONFIRM_EMAIL_CHANGE: '/auth/confirm-email-change',
    REFRESH_TOKEN: '/auth/refresh'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    EMAIL_REQUIRED: 'E-posta gereklidir',
    EMAIL_INVALID: 'Lütfen geçerli bir e-posta adresi girin',
    PASSWORD_REQUIRED: 'Şifre gereklidir',
    PASSWORD_TOO_SHORT: 'Şifre en az 8 karakter olmalıdır',
    PASSWORD_WEAK: 'Şifre büyük/küçük harf ve rakam içermelidir',
    USERNAME_REQUIRED: 'Kullanıcı adı gereklidir',
    USERNAME_TOO_SHORT: 'Kullanıcı adı en az 3 karakter olmalıdır',
    USERNAME_TOO_LONG: 'Kullanıcı adı 30 karakteri aşamaz',
    PASSWORDS_DONT_MATCH: 'Şifreler eşleşmiyor',
    NETWORK_ERROR: 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin',
    INVALID_CREDENTIALS: 'E-posta veya şifre hatalı',
    EMAIL_NOT_VERIFIED: 'Lütfen önce e-posta adresinizi doğrulayın',
    USER_INACTIVE: 'Hesabınız aktif değil',
    EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi zaten kullanımda'
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    REGISTER_SUCCESS: 'Hesabınız oluşturuldu. E-postanıza doğrulama kodu gönderildi.',
    LOGIN_SUCCESS: 'Giriş başarılı!',
    LOGOUT_SUCCESS: 'Çıkış yapıldı',
    EMAIL_VERIFIED: 'E-postanız başarıyla doğrulandı!',
    VERIFICATION_SENT: 'Doğrulama kodu e-postanıza gönderildi',
    PROFILE_UPDATED: 'Profiliniz güncellendi',
    PASSWORD_CHANGED: 'Şifreniz güncellendi',
    EMAIL_CHANGE_REQUESTED: 'Yeni e-postanıza doğrulama kodu gönderildi',
    EMAIL_CHANGED: 'E-postanız başarıyla güncellendi'
  }
}

// Form validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_INVALID
  },
  password: {
    required: true,
    minLength: AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
    // Only enforce minimum length and character variety
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_WEAK
  },
  username: {
    required: true,
    minLength: AUTH_CONSTANTS.USERNAME_MIN_LENGTH,
    maxLength: AUTH_CONSTANTS.USERNAME_MAX_LENGTH,
    pattern: /^\w+$/,
    message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'
  }
} 