<template>
  <div class="min-h-screen bg-[var(--bg-base)] text-white relative">
    <!-- Grain Overlay -->
    <div class="home-hero-grain pointer-events-none" />
    <div class="relative z-50">
      <AppHeader />
    </div>
    
    <!-- Background Ambient Glow -->
    <div class="home-hero-ambient" />

    <main class="relative z-10">
      <div v-if="loading" class="min-h-[80vh] flex items-center justify-center">
      <CinemaSpinner label="Odaya bağlanılıyor..." />
    </div>

    <div v-else-if="roomStore.votingResults !== null" class="animate-fade-in">
      <RoomMatchFound :results="roomStore.votingResults" />
    </div>

    <div v-else-if="roomStore.votingActive" class="animate-fade-in">
      <RoomVoting :is-creator="isCreator" :code="roomCode" />
    </div>

      <div v-else class="animate-fade-in">
        <RoomWaiting 
          :code="roomCode" 
          :participants="roomStore.participants"
          :is-creator="isCreator"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import CinemaSpinner from '~/components/ui/CinemaSpinner.vue'
import RoomWaiting from '~/components/room/RoomWaiting.vue'
import RoomVoting from '~/components/room/RoomVoting.vue'
import RoomMatchFound from '~/components/room/RoomMatchFound.vue'
import AppHeader from '~/components/layout/AppHeader.vue'

const route = useRoute()
const roomCode = route.params.code
const roomStore = useRoomStore()
const authStore = useAuthStore()
const { connect, disconnect } = useRoomWs()
const { getSessionId } = useRoomSession()

const loading = ref(true)

const isCreator = computed(() => {
  return roomStore.roomDetails?.creator_session_id === getSessionId()
})

onMounted(async () => {
  try {
    // Fetch room details first
    const res = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/rooms/${roomCode}`)
    
    if (res) {
      roomStore.setRoomDetails(res)
      roomStore.setParticipants(res.participants || [])
      roomStore.setRoomCode(roomCode)
      
      // Connect to WebSocket
      connect(roomCode)
    }
  } catch (error) {
    console.error('Failed to load room:', error)
    navigateTo('/room')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  disconnect()
  roomStore.resetRoom()
})
</script>
