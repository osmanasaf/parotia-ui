import { defineAsyncComponent } from 'vue'

// Auth Feature Components - Lazy Loading
export const LoginForm = defineAsyncComponent(() => import('./LoginForm.vue'))
export const RegisterForm = defineAsyncComponent(() => import('./RegisterForm.vue'))
export const VerificationForm = defineAsyncComponent(() => import('./VerificationForm.vue')) 