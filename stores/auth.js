import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AUTH_CONSTANTS } from '~/constants'

export const useAuthStore = defineStore('auth', () => {
  // State - sadece authentication durumu
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const hasUser = computed(() => user.value !== null)
  const username = computed(() => user.value?.username || '')
  const email = computed(() => user.value?.email || '')
  const isVerified = computed(() => user.value?.is_verified || false)

  // Actions - sadece state yönetimi
  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    error.value = null
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Getters
    hasUser,
    username,
    email,
    isVerified,
    
    // Actions
    setUser,
    setLoading,
    setError,
    clearError,
    logout
  }
}) 