import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State - sadece UI durumu
  const showLoginModal = ref(false)
  const showRegisterForm = ref(false)
  const showVerificationForm = ref(false)
  const activeForm = ref('login') // 'login', 'register', 'verification'

  // Getters
  const isLoginModalOpen = computed(() => showLoginModal.value)
  const isRegisterFormVisible = computed(() => showRegisterForm.value)
  const isVerificationFormVisible = computed(() => showVerificationForm.value)

  // Actions - sadece UI state yönetimi
  const openLoginModal = () => {
    showLoginModal.value = true
    activeForm.value = 'login'
  }

  const closeLoginModal = () => {
    showLoginModal.value = false
    showRegisterForm.value = false
    showVerificationForm.value = false
    activeForm.value = 'login'
  }

  const showRegister = () => {
    showRegisterForm.value = true
    activeForm.value = 'register'
  }

  const showVerification = () => {
    showVerificationForm.value = true
    activeForm.value = 'verification'
  }

  const backToLogin = () => {
    showRegisterForm.value = false
    showVerificationForm.value = false
    activeForm.value = 'login'
  }

  return {
    // State
    showLoginModal,
    showRegisterForm,
    showVerificationForm,
    activeForm,
    
    // Getters
    isLoginModalOpen,
    isRegisterFormVisible,
    isVerificationFormVisible,
    
    // Actions
    openLoginModal,
    closeLoginModal,
    showRegister,
    showVerification,
    backToLogin
  }
}) 