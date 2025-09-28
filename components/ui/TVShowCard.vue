<template>
  <div 
    class="group cursor-pointer flex-shrink-0 w-48"
    @click="$emit('click')"
  >
    <div class="relative overflow-hidden rounded-lg glass-effect hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div class="aspect-[2/3] bg-gradient-to-br from-blue-800 to-indigo-800 flex items-center justify-center overflow-hidden">
        <NuxtImg 
          v-if="show.poster"
          :src="`https://image.tmdb.org/t/p/w342${show.poster}`" 
          :alt="show.name"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="$event.target.style.display='none'"
        />
        <div v-else class="text-white/60 text-center p-4">
          <div class="text-3xl mb-2">📺</div>
          <div class="text-sm font-medium">{{ show.name }}</div>
        </div>
      </div>
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 class="text-white text-sm font-semibold truncate">{{ show.name }}</h3>
        <div class="flex items-center justify-between mt-1">
          <div class="flex items-center">
            <span class="text-yellow-400 text-xs">⭐</span>
            <span class="text-white/80 text-xs ml-1">{{ show.rating?.toFixed(1) || '—' }}</span>
          </div>
          <div class="flex items-center gap-2" v-if="isLoggedIn">
            <div class="relative">
              <button 
                @click.stop="quickAdd()"
                :disabled="isSaving"
                class="rounded-full p-1 transition-all bg-blue-600/80 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
                :title="isInWatchlist ? 'Eklendi' : 'İzleme listesine ekle'"
              >
                <span v-if="isSaving" class="block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <svg v-else-if="!isInWatchlist" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg v-else class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <span v-if="showAdded" class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded bg-black/80 text-white whitespace-nowrap">Eklendi</span>
              <span v-if="showPing" class="absolute inset-0 rounded-full bg-blue-400/60 animate-ping"></span>
            </div>
            <div class="relative" ref="menuRoot">
              <button @click.stop="menuOpen = !menuOpen" class="rounded-full p-1 bg-white/20 hover:bg-white/30" title="More">
                <svg class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
              </button>
              <div v-if="menuOpen" @click.stop class="absolute bottom-full right-0 mb-2 w-40 bg-black/90 text-white rounded-md shadow-xl ring-1 ring-white/10 z-20">
                <button @click="openRate()" class="block w-full text-left px-3 py-2 hover:bg-white/10">Puanla</button>
                <button @click="addWithStatus('watched')" class="block w-full text-left px-3 py-2 hover:bg-white/10">İzlendi olarak işaretle</button>
                <button v-if="isInWatchlist" @click="addWithStatus('remove')" class="block w-full text-left px-3 py-2 text-red-300 hover:bg-white/10">Kaldır</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dumb component - receives props and emits events
const props = defineProps({
  show: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const { isLoggedIn } = useAuth()
const { addToWatchlist } = useApi()
const isSaving = ref(false)
const isInWatchlist = ref(false)
const menuOpen = ref(false)
const menuRoot = ref(null)
const showAdded = ref(false)
const showPing = ref(false)

const quickAdd = async () => {
  await addWithStatus('to_watch')
}

const addWithStatus = async (status) => {
  try {
    isSaving.value = true
    await addToWatchlist(props.show.id, 'tv', status)
    isInWatchlist.value = status !== 'remove'
    menuOpen.value = false
    showAdded.value = status !== 'remove'
    showPing.value = status !== 'remove'
    if (showAdded.value) setTimeout(() => (showAdded.value = false), 1200)
    if (showPing.value) setTimeout(() => (showPing.value = false), 400)
  } catch (error) {
    console.error('Failed to update watchlist:', error)
  } finally {
    isSaving.value = false
  }
}

const onDocClick = (e) => {
  if (!menuOpen.value) return
  const el = menuRoot.value
  if (el && !el.contains(e.target)) menuOpen.value = false
}
const onKey = (e) => { if (e.key === 'Escape') menuOpen.value = false }
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

// Rate via modal
const rateOpen = ref(false)
const rateValue = ref(7)
const rateComment = ref('')
const { rateContent } = useContent()
const openRate = () => { menuOpen.value = false; rateOpen.value = true }
const onSaveRate = async ({ rating, comment }) => {
  await rateContent({ tmdbId: props.show.id, contentType: 'tv', rating, comment })
  rateOpen.value = false
}

// Kartın tamamı tıklanabilir; info ikonu kaldırıldı
</script> 

<!-- Rating modal -->
<RateModal 
  v-model:open="rateOpen" 
  v-model:modelValue="rateValue" 
  :comment="rateComment" 
  @save="onSaveRate" 
/>