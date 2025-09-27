import { defineAsyncComponent } from 'vue'

// UI Components - Lazy Loading
export const AuthInput = defineAsyncComponent(() => import('./AuthInput.vue'))
export const AuthButton = defineAsyncComponent(() => import('./AuthButton.vue'))
export const AuthModal = defineAsyncComponent(() => import('./AuthModal.vue'))
export const EmailChangeModal = defineAsyncComponent(() => import('./EmailChangeModal.vue'))
export const LoginButton = defineAsyncComponent(() => import('./LoginButton.vue'))
export const ExpandingSearch = defineAsyncComponent(() => import('./ExpandingSearch.vue'))
export const ExpandingSearchDropdown = defineAsyncComponent(() => import('./ExpandingSearchDropdown.vue'))
export const MovieCard = defineAsyncComponent(() => import('./MovieCard.vue'))
export const TVShowCard = defineAsyncComponent(() => import('./TVShowCard.vue'))
export const RecommendationCard = defineAsyncComponent(() => import('./RecommendationCard.vue')) 