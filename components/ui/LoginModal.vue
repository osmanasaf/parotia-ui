<template>
  <div v-if="isLoginModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeModal">
    <div class="glass-effect rounded-2xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h3 class="text-3xl font-bold font-space text-gradient mb-2">Welcome to movAi</h3>
        <p class="text-white/70">Sign in to get personalized recommendations</p>
      </div>
      
      <div class="space-y-4">
        <div>
          <input 
            v-model="loginForm.email"
            type="email" 
            placeholder="Email address"
            class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <input 
            v-model="loginForm.password"
            type="password" 
            placeholder="Password"
            class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex justify-end -mt-2">
          <button @click="openForgot" class="text-blue-400 hover:text-blue-300 text-sm">Forgot your password?</button>
        </div>
        
        <button 
          @click="handleLogin"
          :disabled="!loginForm.email || !loginForm.password"
          class="w-full btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          Sign In
        </button>
        
        <div class="text-center">
          <button 
            @click="showRegisterForm = true"
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <!-- Forgot Password Panel -->
        <div v-if="showForgot" class="border-t border-white/20 pt-4 mt-2">
          <h4 class="text-lg font-semibold text-white mb-3">Password Reset</h4>
          <p class="text-white/70 text-sm mb-3">Enter the email linked to your account. We will send a reset link.</p>
          <div class="space-y-3">
            <input 
              v-model="forgotEmail"
              type="email" 
              placeholder="Email address"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <div v-if="forgotError" class="text-red-300 text-sm">{{ forgotError }}</div>
            <div v-if="forgotSent" class="text-green-300 text-sm">Reset link sent. Check your email.</div>
            <div class="flex gap-2 justify-end">
              <button 
                class="px-3 py-2 rounded-md text-white bg-white/10 hover:bg-white/20"
                @click="closeForgot"
                :disabled="forgotLoading"
              >Cancel</button>
              <button 
                class="px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                @click="handleForgotSubmit"
                :disabled="!forgotEmail || forgotLoading"
              >
                <span v-if="forgotLoading" class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin align-middle mr-2"></span>
                Send Link
              </button>
            </div>
          </div>
        </div>

        <!-- Register Form -->
        <div v-if="isRegisterFormVisible" class="border-t border-white/20 pt-4 mt-4">
          <h4 class="text-lg font-semibold text-white mb-3">Create Account</h4>
          <div class="space-y-3">
            <input 
              v-model="registerForm.username"
              type="text" 
              placeholder="Username"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <input 
              v-model="registerForm.email"
              type="email" 
              placeholder="Email address"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <input 
              v-model="registerForm.password"
              type="password" 
              placeholder="Password"
              class="w-full px-4 py-3 glass-effect border-0 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            
            <button 
              @click="handleRegister"
              :disabled="!registerForm.email || !registerForm.password || !registerForm.username"
              class="w-full btn-outline text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Smart component - handles authentication logic
const authStore = useAuthStore()
const { login, register } = useAuth()
const { requestPasswordReset } = useApi()

const loginForm = computed({
  get: () => authStore.loginForm,
  set: (value) => authStore.setLoginForm(value)
})

const registerForm = computed({
  get: () => authStore.registerForm,
  set: (value) => authStore.setRegisterForm(value)
})

const isLoginModalOpen = computed(() => authStore.isLoginModalOpen)
const isRegisterFormVisible = computed({
  get: () => authStore.isRegisterFormVisible,
  set: (value) => authStore.setShowRegisterForm(value)
})

const showForgot = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotSent = ref(false)
const forgotError = ref('')

const openForgot = () => {
  showForgot.value = true
  forgotSent.value = false
  forgotError.value = ''
  // mevcut e-postayı kopyala
  if (loginForm.value?.email) forgotEmail.value = loginForm.value.email
}

const closeForgot = () => {
  showForgot.value = false
  forgotLoading.value = false
  forgotError.value = ''
}

const closeModal = () => {
  authStore.setShowLoginModal(false)
}

const handleLogin = async () => {
  try {
    const result = await login(loginForm.value.email, loginForm.value.password)
    
    if (result.success) {
      closeModal()
      authStore.resetLoginForm()
      console.log('Login successful!')
    } else {
      console.error('Login failed:', result.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleRegister = async () => {
  try {
    const result = await register(
      registerForm.value.username,
      registerForm.value.email,
      registerForm.value.password
    )
    
    if (result.success) {
      isRegisterFormVisible.value = false
      authStore.resetRegisterForm()
      console.log('Registration successful!')
    } else {
      console.error('Registration failed:', result.error)
    }
  } catch (error) {
    console.error('Registration error:', error)
  }
}

const handleForgotSubmit = async () => {
  if (!forgotEmail.value) return
  forgotLoading.value = true
  forgotError.value = ''
  try {
    await requestPasswordReset(forgotEmail.value)
    forgotSent.value = true
  } catch (error) {
    forgotError.value = error?.data?.message || 'İşlem sırasında bir hata oluştu.'
  } finally {
    forgotLoading.value = false
  }
}
</script> 