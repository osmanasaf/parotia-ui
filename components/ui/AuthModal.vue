<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="handleBackdropClick"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    
    <!-- Modal -->
    <div
      class="relative w-full max-w-md bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ modalTitle }}
        </h2>
        <p class="text-white/70">
          {{ modalSubtitle }}
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
      >
        <p class="text-red-400 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
      >
        <p class="text-green-400 text-sm">{{ successMessage }}</p>
      </div>

      <!-- Forms -->
      <ClientOnly>
        <LoginForm
          v-if="activeForm === 'login'"
          @success="handleLoginSuccess"
          @error="handleError"
          @show-register="showRegister"
          @show-verification="handleShowVerification"
          @forgot-password="handleForgotPassword"
        />

        <RegisterForm
          v-if="activeForm === 'register'"
          @success="handleRegisterSuccess"
          @error="handleError"
          @show-login="showLogin"
        />

        <VerificationForm
          v-if="activeForm === 'verification'"
          :email="verificationEmail"
          @success="handleVerificationSuccess"
          @error="handleError"
          @back-to-login="showLogin"
          @show-login="handleShowLogin"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useUIStore } from '~/stores/ui'
import { useAuth } from '~/composables/useAuth'
import { LoginForm, RegisterForm, VerificationForm } from '~/components/features/auth'

const uiStore = useUIStore()
const { error } = useAuth()

// Computed properties
const isOpen = computed(() => uiStore.isLoginModalOpen)
const activeForm = computed(() => uiStore.activeForm)
const errorMessage = computed(() => error.value)
const successMessage = ref('')

const modalTitle = computed(() => {
  switch (activeForm.value) {
    case 'login':
      return 'Giriş Yap'
    case 'register':
      return 'Hesap Oluştur'
    case 'verification':
      return 'Email Doğrulama'
    default:
      return 'Giriş Yap'
  }
})

const modalSubtitle = computed(() => {
  switch (activeForm.value) {
    case 'login':
      return 'Hesabınıza giriş yapın'
    case 'register':
      return 'Yeni hesap oluşturun'
    case 'verification':
      return 'Email adresinizi doğrulayın'
    default:
      return 'Hesabınıza giriş yapın'
  }
})

// Verification email state
const verificationEmail = ref('')

// Event handlers
const closeModal = () => {
  uiStore.closeLoginModal()
}

const handleBackdropClick = () => {
  closeModal()
}

const showLogin = () => {
  uiStore.backToLogin()
}

const showRegister = () => {
  uiStore.showRegister()
}

const handleLoginSuccess = (user) => {
  closeModal()
  // Başarı mesajı gösterilebilir
}

const handleRegisterSuccess = (user) => {
  verificationEmail.value = user.email
  uiStore.showVerification()
}

const handleVerificationSuccess = (result) => {
  // Başarı mesajını göster
  successMessage.value = result.message || 'Email adresiniz başarıyla doğrulandı!'
  
  // 3 saniye sonra login formuna geç
  setTimeout(() => {
    successMessage.value = ''
    if (result.email) {
      verificationEmail.value = result.email
    }
    showLogin()
  }, 3000)
}

const handleShowVerification = (email) => {
  verificationEmail.value = email
  uiStore.showVerification()
}

const handleShowLogin = (email) => {
  // Login formuna geç ve email'i doldur
  uiStore.backToLogin()
  // Email'i login formuna geçirmek için bir yöntem bulunabilir
}

const handleError = (errorMsg) => {
  // Error zaten store'da yönetiliyor
}

const handleForgotPassword = () => {
  // Şifre sıfırlama sayfasına yönlendir
  closeModal()
  navigateTo('/forgot-password')
}

// Error değişikliklerini dinle
watch(error, (newError) => {
  if (newError) {
    // Error mesajını 5 saniye sonra temizle
    setTimeout(() => {
      // Error store'dan temizlenir
    }, 5000)
  }
})
</script> 