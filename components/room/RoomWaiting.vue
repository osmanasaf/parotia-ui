<template>
  <div class="max-w-4xl mx-auto px-4 py-12 relative">
    <div class="flex flex-col md:flex-row gap-12 items-start">
      <!-- Left: Room Info & Mood Input -->
      <div class="flex-1 space-y-8 w-full">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full uppercase tracking-widest border border-amber-500/20">BEKLEME ODASI</span>
            <span class="text-white/40 text-sm font-mono">{{ code }}</span>
          </div>
          <h2 class="text-4xl font-bold mb-4">Ortak Bir Karar Verin</h2>
          <p class="text-white/60 leading-relaxed">
            Herkes katıldıktan ve ne izlemek istediğini belirttikten sonra yapay zeka ortak zevkinize göre öneriler getirecek.
          </p>
        </div>

        <div v-if="!roomStore.myStatus.submittedMood" class="bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-xl">
          <h3 class="text-xl font-bold mb-6">Ne izlemek istersiniz?</h3>
          <textarea 
            v-model="moodText"
            placeholder="Örn: 'Çok heyecanlı bir aksiyon olsun ama biraz da duygusal bir yanı bulunsun...'"
            class="w-full min-h-[140px] p-5 bg-black/40 rounded-2xl text-white placeholder-white/30 border border-white/10 focus:border-amber-500/50 focus:outline-none transition-all resize-none mb-6"
          />
          <button 
            @click="handleSubmitMood"
            :disabled="!moodText.trim() || moodText.length < 5"
            class="w-full py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95"
          >
            Modumu Gönder
          </button>
        </div>

        <div v-else class="bg-emerald-500/10 p-8 rounded-[32px] border border-emerald-500/20 backdrop-blur-xl flex flex-col items-center text-center">
          <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-4 text-black">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-emerald-500 mb-2">Modunuz Alındı!</h3>
          <p class="text-white/60 text-sm">Diğer katılımcıların hazır olması bekleniyor...</p>
        </div>

        <!-- Room Link Copy -->
        <div class="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div class="text-sm font-medium text-white/50">Arkadaşlarını davet et:</div>
          <div class="flex items-center gap-2 relative">
            <code class="px-2 py-1 bg-black rounded text-amber-500 font-bold tracking-widest">{{ code }}</code>
            <button @click="copyLink" class="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
            </button>
            <transition name="tooltip-fade">
              <span v-if="copied" class="absolute -top-10 right-0 bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Link kopyalandı!
              </span>
            </transition>
          </div>
        </div>
      </div>

      <!-- Right: Participants -->
      <div class="w-full md:w-80 space-y-6">
        <h3 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">KATILIMCILAR ({{ participants.length }}/5)</h3>
        <div class="space-y-3">
          <div 
            v-for="(p, i) in participants" :key="p.session_id || i"
            class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all"
          >
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center font-bold text-black border-2 border-transparent group-hover:border-white/20 transition-all">
                  {{ (p.username?.charAt(0) || 'M').toUpperCase() }}
                </div>
                <div 
                  v-if="p.is_online"
                  class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0d0d0d]"
                ></div>
              </div>
              <div>
                <div class="font-bold text-sm">{{ p.username || `Misafir ${p.session_id ? p.session_id.substring(0,4).toUpperCase() : i + 1}` }} <span v-if="p.session_id === getSessionId()" class="text-[10px] text-amber-500 font-bold ml-1">(Sen)</span></div>
                <div class="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {{ (p.submitted_mood || p.is_ready) ? 'HAZIR' : 'BEKLENİYOR' }}
                </div>
              </div>
            </div>
            <div v-if="p.submitted_mood || p.is_ready" class="text-emerald-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div v-for="n in 5 - participants.length" :key="'empty-'+n" class="p-4 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
            <span class="text-[10px] font-bold text-white/10 uppercase tracking-widest">BOŞ KOLTUK</span>
          </div>
        </div>

        <div v-if="isCreator && canStart" class="pt-6">
          <button 
            @click="handleStartVoting"
            :disabled="starting"
            class="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 shadow-xl transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
          >
            <svg v-if="starting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ starting ? 'Oylama Başlatılıyor...' : (allReady ? 'Oylamayı Başlat' : 'Erken Başlat') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  code: String,
  participants: Array,
  isCreator: Boolean
})

const roomStore = useRoomStore()
const { submitMood, forceStart } = useRoomWs()
const { getSessionId } = useRoomSession()
const moodText = ref('')
const copied = ref(false)
const starting = ref(false)

const allReady = computed(() => {
  return props.participants.length >= 2 && props.participants.every(p => p.submitted_mood || p.is_ready)
})

const canStart = computed(() => {
  return roomStore.myStatus.submittedMood && props.participants.length >= 1
})

const handleSubmitMood = () => {
  if (moodText.value.trim().length >= 5) {
    submitMood(moodText.value)
  }
}

const handleStartVoting = () => {
  starting.value = true
  forceStart()
}

const copyLink = () => {
  const url = `${window.location.origin}/room/${props.code}`
  navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
