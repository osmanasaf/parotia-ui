<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">🔐 Authentication Test Sayfası</h1>
      
      <!-- Kullanıcı Durumu -->
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">Kullanıcı Durumu</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-white/70">Giriş Yapıldı:</p>
            <p class="text-white font-medium">{{ isLoggedIn ? 'Evet' : 'Hayır' }}</p>
          </div>
          <div>
            <p class="text-white/70">Kullanıcı Adı:</p>
            <p class="text-white font-medium">{{ username || 'Giriş yapılmamış' }}</p>
          </div>
          <div>
            <p class="text-white/70">Email:</p>
            <p class="text-white font-medium">{{ email || 'Giriş yapılmamış' }}</p>
          </div>
          <div>
            <p class="text-white/70">Email Doğrulandı:</p>
            <p class="text-white font-medium">{{ isVerified ? 'Evet' : 'Hayır' }}</p>
          </div>
        </div>
      </div>

      <!-- Test Butonları -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          @click="openLoginModal"
          class="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          🔑 Login Modal Aç
        </button>
        
        <button
          @click="testLogin"
          class="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          ✅ Test Login
        </button>
        
        <button
          @click="testRegister"
          class="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          📝 Test Register
        </button>
        
        <button
          @click="testLogout"
          class="p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          🚪 Logout
        </button>
        
        <button
          @click="testGetCurrentUser"
          class="p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
        >
          👤 Get Current User
        </button>
        
        <button
          @click="testSendVerification"
          class="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          📧 Send Verification
        </button>
      </div>

      <!-- Hata ve Yükleme Durumu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-white mb-2">Yükleme Durumu</h3>
          <p class="text-white/70">{{ isLoading ? 'Yükleniyor...' : 'Hazır' }}</p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-white mb-2">Hata Durumu</h3>
          <p class="text-white/70">{{ error || 'Hata yok' }}</p>
        </div>
      </div>

      <!-- Test Sonuçları -->
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Test Sonuçları</h2>
        <pre class="text-white/80 text-sm overflow-auto">{{ testResults }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUIStore } from '~/stores/ui'

const { 
  isLoggedIn, 
  currentUser, 
  isLoading, 
  error, 
  login, 
  register, 
  logout, 
  getCurrentUser, 
  sendVerificationCode 
} = useAuth()

const uiStore = useUIStore()

const username = computed(() => currentUser.value?.username || '')
const email = computed(() => currentUser.value?.email || '')
const isVerified = computed(() => currentUser.value?.is_verified || false)

const testResults = ref('')

const openLoginModal = () => {
  uiStore.openLoginModal()
}

const testLogin = async () => {
  testResults.value = 'Login test başlatılıyor...\n'
  
  const result = await login({
    email: 'test@example.com',
    password: 'TestPass123'
  })
  
  testResults.value += `Login sonucu: ${JSON.stringify(result, null, 2)}\n`
}

const testRegister = async () => {
  testResults.value = 'Register test başlatılıyor...\n'
  
  const result = await register({
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPass123'
  })
  
  testResults.value += `Register sonucu: ${JSON.stringify(result, null, 2)}\n`
}

const testLogout = () => {
  testResults.value = 'Logout yapılıyor...\n'
  logout()
  testResults.value += 'Logout tamamlandı\n'
}

const testGetCurrentUser = async () => {
  testResults.value = 'Get current user test başlatılıyor...\n'
  
  const result = await getCurrentUser()
  
  testResults.value += `Get current user sonucu: ${JSON.stringify(result, null, 2)}\n`
}

const testSendVerification = async () => {
  testResults.value = 'Send verification test başlatılıyor...\n'
  
  const result = await sendVerificationCode('test@example.com')
  
  testResults.value += `Send verification sonucu: ${JSON.stringify(result, null, 2)}\n`
}

useHead({
  title: 'Authentication Test - Parotia'
})
</script> 