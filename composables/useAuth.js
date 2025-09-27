import { computed } from 'vue'
import { AUTH_CONSTANTS } from '~/constants'
import { useAuthStore } from '~/stores/auth'
import { useTokenManager } from '~/composables/useTokenManager'
import { useFormValidation } from '~/composables/useFormValidation'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { setToken, removeToken, getAuthHeaders } = useTokenManager()
  const { validateLoginForm, validateVerificationForm } = useFormValidation()
  const config = useRuntimeConfig()

  // Decode user info from JWT
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

  // API calls
  const register = async (userData) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        body: userData
      })

      // Validate backend response shape
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

      // Validate response shape
      if (response.access_token) {
        setToken(response.access_token)
        
        // Decode user info from token
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
      
      // Check unverified email error for various shapes
      const errorData = error.data || error.response?.data || error
      const errorCode = errorData?.error_code || errorData?.detail?.error_code
      const errorMessage = errorData?.message || errorData?.detail?.message || errorData?.detail || errorData?.statusMessage
      
      if (errorCode === 'EMAIL_NOT_VERIFIED') {
        return { 
          success: false, 
          error: errorMessage || 'Please verify your email before logging in',
          requiresVerification: true,
          email: credentials.email
        }
      }
      
      // Other error cases
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

      // Validate response shape
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

      // Validate response shape
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

      // Validate response shape
      if (response.message || response.success || response.id) {
        return { 
          success: true, 
          message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.EMAIL_VERIFIED, 
          user: response.id ? response : null,
          email: email // Pass back email for login form convenience
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

  const updateProfile = async (profileUpdates) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        return { success: false, error: 'Authentication required' }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.ME}`, {
        method: 'PUT',
        headers,
        body: profileUpdates
      })

      const updatedUser = response?.user || response

      if (updatedUser?.id || updatedUser?.email) {
        authStore.setUser(updatedUser)
        return { success: true, user: updatedUser, message: AUTH_CONSTANTS.SUCCESS_MESSAGES.PROFILE_UPDATED }
      }

      const fallbackMessage = AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(fallbackMessage)
      return { success: false, error: fallbackMessage }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || error.data?.detail || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const changePassword = async ({ current_password, new_password }) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        return { success: false, error: 'Authentication required' }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers,
        body: { current_password, new_password }
      })

      if (response?.message || response?.success) {
        return { success: true, message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.PASSWORD_CHANGED }
      }

      const fallbackMessage = AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(fallbackMessage)
      return { success: false, error: fallbackMessage }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || error.data?.detail || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const requestEmailChange = async (newEmail) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        return { success: false, error: 'Authentication required' }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.REQUEST_EMAIL_CHANGE}`, {
        method: 'POST',
        headers,
        body: { new_email: newEmail }
      })

      if (response?.message || response?.success) {
        return { success: true, message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.EMAIL_CHANGE_REQUESTED }
      }

      const fallbackMessage = AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(fallbackMessage)
      return { success: false, error: fallbackMessage }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || error.data?.detail || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  const confirmEmailChange = async ({ new_email, code }) => {
    try {
      authStore.setLoading(true)
      authStore.clearError()

      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        return { success: false, error: 'Authentication required' }
      }

      const response = await $fetch(`${config.public.apiBaseUrl}${AUTH_CONSTANTS.ENDPOINTS.CONFIRM_EMAIL_CHANGE}`, {
        method: 'POST',
        headers,
        body: { new_email, code }
      })

      const updatedUser = response?.user || response
      if (updatedUser?.email) {
        authStore.setUser(updatedUser)
        return { success: true, user: updatedUser, message: response?.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.EMAIL_CHANGED }
      }

      const fallbackMessage = AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
      authStore.setError(fallbackMessage)
      return { success: false, error: fallbackMessage }
    } catch (error) {
      const errorMessage = error.data?.statusMessage || error.data?.detail || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
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
    verifyEmail,
    updateProfile,
    changePassword,
    requestEmailChange,
    confirmEmailChange
  }
} 