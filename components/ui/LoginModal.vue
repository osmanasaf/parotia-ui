<template>
  <div v-if="isLoginModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeModal">
    <div class="glass-effect rounded-2xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h3 class="text-3xl font-bold font-space text-gradient mb-2">Welcome to Parotia</h3>
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
</script> 