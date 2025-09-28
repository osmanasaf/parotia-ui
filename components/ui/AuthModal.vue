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

        <!-- Forgot Password Panel -->
        <div v-if="activeForm === 'forgot'" class="space-y-4">
          <div class="text-white/80 text-sm">
            {{ forgotStep === 1 ? 'E-posta adresini gir. Şifre sıfırlama bağlantısı göndereceğiz.' : 'E-postana gelen kodu ve yeni şifreni gir.' }}
          </div>
          <input
            v-model="forgotEmail"
            type="email"
            placeholder="E-posta adresi"
            class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="forgotStep !== 1"
          />
          <div v-if="forgotStep === 2" class="space-y-3">
            <input
              v-model="forgotCode"
              type="text"
              placeholder="Doğrulama kodu"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="forgotNewPassword"
              type="password"
              placeholder="Yeni şifre"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div v-if="forgotError" class="text-red-300 text-sm">{{ forgotError }}</div>
          <div v-if="forgotSent && forgotStep === 1" class="text-green-300 text-sm">Bağlantı gönderildi. E-postanı kontrol et.</div>
          <div class="flex gap-2 justify-end">
            <button class="px-3 py-2 rounded-md text-white bg-white/10 hover:bg-white/20" @click="showLogin" :disabled="forgotLoading">Geri</button>
            <button
              v-if="forgotStep === 1"
              class="px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              @click="handleForgotSubmit"
              :disabled="!forgotEmail || forgotLoading"
            >
              <span v-if="forgotLoading" class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin align-middle mr-2"></span>
              Bağlantıyı Gönder
            </button>
            <button
              v-else
              class="px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              @click="handleForgotConfirm"
              :disabled="!forgotEmail || !forgotCode || !forgotNewPassword || forgotLoading"
            >
              <span v-if="forgotLoading" class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin align-middle mr-2"></span>
              Şifreyi Sıfırla
            </button>
          </div>
        </div>
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
const { requestPasswordReset, resetPassword } = useApi()

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
      return 'E-posta Doğrulama'
    case 'forgot':
      return 'Şifre Sıfırlama'
    default:
      return 'Giriş Yap'
  }
})

const modalSubtitle = computed(() => {
  switch (activeForm.value) {
    case 'login':
      return 'Hesabına giriş yap'
    case 'register':
      return 'Yeni bir hesap oluştur'
    case 'verification':
      return 'E-posta adresini doğrula'
    case 'forgot':
      return 'E-postana bir sıfırlama bağlantısı/kodu göndereceğiz'
    default:
      return 'Hesabına giriş yap'
  }
})

// Verification email state
const verificationEmail = ref('')

// Forgot state
const forgotEmail = ref('')
const forgotCode = ref('')
const forgotNewPassword = ref('')
const forgotStep = ref(1) // 1: request, 2: confirm
const forgotLoading = ref(false)
const forgotSent = ref(false)
const forgotError = ref('')

// Event handlers
const closeModal = () => {
  uiStore.closeLoginModal()
}

const handleBackdropClick = () => {
  closeModal()
}

const showLogin = () => {
  uiStore.backToLogin()
  forgotEmail.value = ''
  forgotCode.value = ''
  forgotNewPassword.value = ''
  forgotSent.value = false
  forgotError.value = ''
  forgotStep.value = 1
}

const showRegister = () => {
  uiStore.showRegister()
}

const handleLoginSuccess = (user) => {
  closeModal()
}

const handleRegisterSuccess = (user) => {
  verificationEmail.value = user.email
  uiStore.showVerification()
}

const handleVerificationSuccess = (result) => {
  successMessage.value = result.message || 'E-postan başarıyla doğrulandı!'
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
  uiStore.backToLogin()
}

const handleError = (errorMsg) => {}

const handleForgotPassword = () => {
  forgotEmail.value = ''
  forgotError.value = ''
  forgotSent.value = false
  forgotStep.value = 1
  uiStore.activeForm = 'forgot'
}

const handleForgotSubmit = async () => {
  if (!forgotEmail.value) return
  forgotLoading.value = true
  forgotError.value = ''
  try {
    await requestPasswordReset(forgotEmail.value)
    forgotSent.value = true
    forgotStep.value = 2
  } catch (e) {
    forgotError.value = e?.data?.message || 'İşlem sırasında bir hata oluştu.'
  } finally {
    forgotLoading.value = false
  }
}

const handleForgotConfirm = async () => {
  if (!forgotEmail.value || !forgotCode.value || !forgotNewPassword.value) return
  forgotLoading.value = true
  forgotError.value = ''
  try {
    await resetPassword(forgotEmail.value, forgotCode.value, forgotNewPassword.value)
    successMessage.value = 'Şifren başarıyla güncellendi. Giriş yapabilirsin.'
    showLogin()
  } catch (e) {
    forgotError.value = e?.data?.message || 'İşlem sırasında bir hata oluştu.'
  } finally {
    forgotLoading.value = false
  }
}

// Error değişikliklerini dinle
watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
    }, 5000)
  }
})
</script> 