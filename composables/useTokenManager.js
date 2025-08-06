import { AUTH_CONSTANTS } from '~/constants'

export const useTokenManager = () => {
  const setToken = (token) => {
    if (process.client) {
      localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token)
    }
  }

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY)
    }
    return null
  }

  const removeToken = () => {
    if (process.client) {
      localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
    }
  }

  const isTokenValid = (token) => {
    if (!token) return false
    
    try {
      // JWT token'ın payload kısmını decode et
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      
      return payload.exp > now
    } catch (error) {
      return false
    }
  }

  const getAuthHeaders = () => {
    const token = getToken()
    
    if (!token || !isTokenValid(token)) {
      return {}
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }



  const shouldRefreshToken = (token) => {
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      const timeUntilExpiry = payload.exp - now
      
      // Token 5 dakika içinde expire olacaksa yenile
      return timeUntilExpiry < 300
    } catch (error) {
      return false
    }
  }

  return {
    setToken,
    getToken,
    removeToken,
    isTokenValid,
    getAuthHeaders,
    shouldRefreshToken
  }
} 