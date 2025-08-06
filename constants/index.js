// Auth Constants
export { AUTH_CONSTANTS, VALIDATION_RULES } from './auth'

// API Constants
export const API_ENDPOINTS = {
  CONTENT_SEARCH: '/content/search',
  POPULAR_MOVIES: '/movies/popular',
  POPULAR_TV: '/tv/popular',
  WATCH_PROVIDERS: '/watch/providers'
}

export const API_TIMEOUTS = {
  SEARCH_DEBOUNCE: 300,
  AUTO_SCROLL_MOVIES: 3000,
  AUTO_SCROLL_TV: 4000
}

// UI Constants
export const CAROUSEL_SCROLL_AMOUNT = 300
export const MAX_RECENT_SEARCHES = 10
export const MAX_SEARCH_RESULTS = 5
export const MAX_RECENT_DISPLAY = 6

// Content Types
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  ALL: 'all'
}

// Countries
export const COUNTRIES = {
  TR: 'TR',
  US: 'US',
  GB: 'GB',
  DE: 'DE',
  FR: 'FR',
  IT: 'IT',
  ES: 'ES',
  NL: 'NL',
  CA: 'CA',
  AU: 'AU',
  JP: 'JP',
  KR: 'KR',
  BR: 'BR',
  MX: 'MX',
  IN: 'IN'
}

// Image Sizes
export const IMAGE_SIZES = {
  POSTER_SMALL: 'w200',
  POSTER_MEDIUM: 'w342',
  POSTER_LARGE: 'w500'
}

// Default Values
export const DEFAULTS = {
  COUNTRY: COUNTRIES.TR,
  PAGE: 1,
  CONTENT_TYPE: CONTENT_TYPES.ALL
} 