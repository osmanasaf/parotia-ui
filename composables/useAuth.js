import { computed } from 'vue'
import { AUTH_CONSTANTS } from '~/constants'
import { useAuthStore } from '~/stores/auth'
import { useTokenManager } from '~/composables/useTokenManager'
import { useFormValidation } from '~/composables/useFormValidation'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { setToken, removeToken, getAuthHeaders } = useTokenManager()
  const { validateLoginForm, validateRegisterForm, validateVerificationForm } = useFormValidation()
  const config = useRuntimeConfig()

  // JWT token'dan user bilgilerini çıkar
  const decodeJWT = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload.sub,
        email: payload.email || '',
        username: payload.username || '',
        is_verified: payload.is_verified || true,
        is_active: payload.is_active || true
      }
    } catch (error) {
      console.error('JWT decode error:', error)
      return {
        id: 'unknown',
        email: '',
        username: '',
        is_verified: true,
        is_active: true
      }
    }
  }

  // API çağrıları
  const register = async (userData) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        body: userData
      })

      // Backend response formatını kontrol et
      if (response.id || response.email) {
        return { success: true, user: response, message: AUTH_CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS }
      } else {
        authStore.setError(AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR)
        return { success: false, error: 'Registration failed' }
      }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const validationErrors = validateLoginForm(credentials)
      if (Object.keys(validationErrors).length > 0) {
        authStore.setError(Object.values(validationErrors)[0])
        return { success: false, errors: validationErrors }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        body: credentials
      })

      // Backend'den gelen response formatını kontrol et
      if (response.access_token) {
        setToken(response.access_token)
        
        // Token'dan user bilgilerini çıkar (JWT decode)
        const user = decodeJWT(response.access_token)
        authStore.setUser(user)
        
        return { success: true, user: user }
      } else {
        authStore.setError(AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR)
        return { success: false, error: 'Invalid response format' }
      }
    } catch (error) {
      console.log('Login error:', error)
      console.log('Error data:', error.data)
      console.log('Error response:', error.response)
      
      // Email doğrulanmamış hatası kontrolü - tüm olası formatları kontrol et
      const errorData = error.data || error.response?.data || error
      const errorCode = errorData?.error_code || errorData?.detail?.error_code
      const errorMessage = errorData?.message || errorData?.detail?.message || errorData?.detail || errorData?.statusMessage
      
      if (errorCode === 'EMAIL_NOT_VERIFIED') {
        return { 
          success: false, 
          error: errorMessage || 'Lütfen giriş yapmadan önce email adresinizi doğrulayın',
          requiresVerification: true,
          email: credentials.email
        }
      }
      
      // Diğer hata durumları
      const finalErrorMessage = errorMessage || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(finalErrorMessage)
      return { success: false, error: finalErrorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    authStore.logout()
  }

  const getCurrentUser = async () => {
    try {
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        return { success: false, error: 'No token found' }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.ME}`, {
        headers
      })

      // Backend response formatını kontrol et
      if (response.id || response.email) {
        authStore.setUser(response)
        return { success: true, user: response }
      } else {
        return { success: false, error: 'Failed to get user data' }
      }
    } catch (error) {
      if (error.statusCode === 401) {
        logout()
      }
      return { success: false, error: error.data?.statusMessage || 'Failed to get user' }
    }
  }

  const sendVerificationCode = async (email) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.SEND_VERIFICATION}?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      })

      // Backend response formatını kontrol et
      if (response.message || response.success) {
        return { success: true, message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.VERIFICATION_SENT }
      } else {
        authStore.setError(AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR)
        return { success: false, error: 'Failed to send verification code' }
      }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const verifyEmail = async (email, code) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const validationErrors = validateVerificationForm({ email, code })
      if (Object.keys(validationErrors).length > 0) {
        authStore.setError(Object.values(validationErrors)[0])
        return { success: false, errors: validationErrors }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.VERIFY_EMAIL}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
        method: 'POST'
      })

      // Backend response formatını kontrol et
      if (response.message || response.success || response.id) {
        return { 
          success: true, 
          message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.EMAIL_VERIFIED, 
          user: response.id ? response : null,
          email: email // Email'i de döndür ki login formuna geçebilsin
        }
      } else {
        authStore.setError(AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR)
        return { success: false, error: 'Email verification failed' }
      }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Computed properties
  const isLoggedIn = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)

  return {
    // State
    isLoggedIn,
    currentUser,
    isLoading,
    error,
    
    // Actions
    register,
    login,
    logout,
    getCurrentUser,
    sendVerificationCode,
    verifyEmail
  }
} 