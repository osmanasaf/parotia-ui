<template>
  <div class="min-h-screen bg-[var(--bg-base)] text-white relative">
    <!-- Grain Overlay -->
    <div class="home-hero-grain pointer-events-none"></div>

    <div class="relative z-50">
      <AppHeader />
    </div>

    <main class="flex flex-col items-center justify-center py-20 px-4">
      <!-- Background Ambient Glow -->
      <div class="home-hero-ambient"></div>

      <div class="max-w-md w-full">
        <!-- Lobby State -->
        <div v-if="!showJoinInput && !showCreateOptions" class="text-center animate-fade-in">
          <div class="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-1 ring-amber-500/30">
            <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-4 tracking-tight">Ortak İzleme Odası</h1>
          <p class="text-white/60 mb-12 leading-relaxed">Arkadaşlarınızla aynı anda film/dizi seçin. Sağa kaydırın, eşleşin, izleyin!</p>

          <div class="space-y-4">
            <button
              @click="handleCreateClick"
              class="w-full py-4 px-6 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.2)] active:scale-95"
            >
              Yeni Oda Oluştur
            </button>
            <button
              @click="showJoinInput = true"
              class="w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 ring-1 ring-white/10 transition-all active:scale-95"
            >
              Bir Odaya Katıl
            </button>
          </div>

          <p v-if="authErrorMessage" class="text-amber-400 text-sm text-center mt-4 animate-fade-in">
            {{ authErrorMessage }}
          </p>
        </div>
        <div v-else-if="showCreateOptions" class="bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-xl animate-scale-in">
          <h2 class="text-2xl font-bold mb-6">Oda Ayarları</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">İçerik Türü</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="type in contentTypes" :key="type.value"
                  @click="createForm.content_type = type.value"
                  :class="['py-3 rounded-xl text-sm font-semibold transition-all', createForm.content_type === type.value ? 'bg-amber-500 text-black' : 'bg-white/5 text-white hover:bg-white/10']"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Maksimum Katılımcı ({{ createForm.max_participants }})</label>
              <input type="range" v-model="createForm.max_participants" min="2" max="5" class="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Oylama Süresi ({{ createForm.duration_minutes }} Dakika)</label>
              <input type="range" v-model="createForm.duration_minutes" min="2" max="15" class="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div class="pt-4 flex gap-3">
              <button @click="showCreateOptions = false" class="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all">İptal</button>
              <button @click="handleCreateRoom" :disabled="creating" class="flex-[2] py-4 bg-amber-500 text-black rounded-2xl font-bold hover:bg-amber-400 disabled:opacity-50 transition-all">
                {{ creating ? 'Oda Kuruluyor...' : 'Odayı Kur' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="showJoinInput" class="bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-xl animate-scale-in">
          <h2 class="text-2xl font-bold mb-4">Odaya Katıl</h2>
          <p class="text-white/60 mb-8 leading-relaxed">
            Arkadaşınızın paylaştığı 6 haneli özel erişim kodunu aşağıya girerek oylamaya anında dahil olabilirsiniz.
          </p>

          <div class="space-y-6">
            <input
              v-model="joinCode"
              type="text"
              placeholder="Oda Kodu (örn: XJ29L)"
              maxlength="6"
              class="w-full py-5 bg-black/40 rounded-2xl text-center text-2xl font-mono tracking-[0.3em] font-bold border border-white/10 focus:border-amber-500/50 focus:outline-none transition-all"
              autofocus
              @keyup.enter="handleJoinRoom"
            />

            <div class="pt-4 flex gap-3">
              <button @click="showJoinInput = false" class="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all">Geri</button>
              <button @click="handleJoinRoom" :disabled="!joinCode || joinCode.length < 4 || joining" class="flex-[2] py-4 bg-amber-500 text-black rounded-2xl font-bold hover:bg-amber-400 disabled:opacity-50 transition-all">
                {{ joining ? 'Katılınıyor...' : 'Katıl' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'

const { createRoom, getRoomDetails } = useApi() // need to check if these exist or need to add
const roomStore = useRoomStore()
const uiStore = useUIStore()
const authStore = useAuthStore()
const { getAuthHeaders } = useTokenManager()
const { getSessionId } = useRoomSession()

const showJoinInput = ref(false)
const showCreateOptions = ref(false)
const creating = ref(false)
const joining = ref(false)
const joinCode = ref('')
const authErrorMessage = ref('')

const contentTypes = [
  { label: 'Film', value: 'movie' },
  { label: 'Dizi', value: 'tv' },
  { label: 'Karışık', value: 'mixed' }
]

const createForm = ref({
  content_type: 'movie',
  max_participants: 4,
  duration_minutes: 5
})

const handleCreateClick = () => {
  if (!authStore.isAuthenticated) {
    authErrorMessage.value = 'Oda oluşturmak için giriş yapmalısınız.'
    uiStore.openLoginModal()
    return
  }
  authErrorMessage.value = ''
  showCreateOptions.value = true
}

const handleCreateRoom = async () => {
  if (!authStore.isAuthenticated) {
    authErrorMessage.value = 'Oda oluşturmak için giriş yapmalısınız.'
    uiStore.openLoginModal()
    return
  }
  creating.value = true
  try {
    const payload = {
      ...createForm.value,
      creator_session_id: getSessionId()
    }
    const res = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/rooms/`, {
      method: 'POST',
      body: payload,
      headers: getAuthHeaders()
    })
    
    if (res.code) {
      roomStore.setRoomCode(res.code)
      navigateTo(`/room/${res.code}`)
    }
  } catch (error) {
    console.error('Room creation error:', error)
  } finally {
    creating.value = false
  }
}

const handleJoinRoom = async () => {
  joining.value = true
  try {
    const code = joinCode.value.toUpperCase()
    const res = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/rooms/${code}`)
    
    if (res) {
      roomStore.setRoomCode(code)
      navigateTo(`/room/${code}`)
    }
  } catch (error) {
    console.error('Room joining error:', error)
  } finally {
    joining.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
