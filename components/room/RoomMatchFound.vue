<template>
  <div class="relative z-50 flex flex-col items-center justify-start p-4 md:p-6 bg-transparent min-h-[80vh] overflow-x-hidden pt-6 md:pt-12">
    <!-- Confetti / Particles Background for top match -->
    <div v-if="hasMatches" class="absolute inset-0 pointer-events-none opacity-50 z-0">
      <div v-for="n in 30" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
    </div>

    <div class="max-w-4xl w-full relative z-10 animate-match-reveal">
      <div class="text-center mb-12">
        <div v-if="hasMatches" class="inline-block px-4 py-1 bg-amber-500 text-black text-xs font-black rounded-full uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(245,158,11,0.5)]">SONUÇLAR BELLİ OLDU</div>
        <div v-else class="inline-block px-4 py-1 bg-white/20 text-white text-xs font-black rounded-full uppercase tracking-[0.3em] mb-6">OYLAMA BİTTİ</div>
        
        <h2 class="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 tracking-tighter">
          {{ hasMatches ? 'İşte Ortak Kararlarınız' : 'Ortak Bir Karara Varamadınız' }}
        </h2>
        <p v-if="!hasMatches" class="text-white/60 text-lg">Hiçbir yapımda ortak bir beğeni oluşmadı.</p>
      </div>

      <!-- Top Match -->
      <div v-if="hasMatches" class="bg-[var(--bg-secondary)] rounded-[48px] border border-amber-500/30 overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row shadow-amber-500/10 mb-8 relative">
        <div class="absolute top-4 left-4 bg-amber-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-black text-xl z-20 shadow-lg">#1</div>
        <div class="w-full md:w-2/5 aspect-[2/3] relative">
          <NuxtImg 
            :src="`https://image.tmdb.org/t/p/w780${topMatch.poster_path}`"
            :alt="topMatch.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--bg-secondary)]"></div>
        </div>
        
        <div class="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h3 class="text-4xl font-bold mb-6">{{ topMatch.title }}</h3>
          
          <div class="flex flex-wrap items-center gap-4 mb-8">
            <div class="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl font-bold border border-amber-500/20">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              {{ topMatch.vote_average?.toFixed(1) || '-' }}
            </div>
            <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 font-medium">
              {{ topMatch.release_year || topMatch.release_date?.substring(0,4) || '-' }}
            </div>
          </div>

          <p class="text-lg text-white/60 leading-relaxed mb-10 line-clamp-4 italic">
            "{{ topMatch.overview || 'Açıklama bulunmuyor.' }}"
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="goToDetails(topMatch)"
              class="flex-1 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Hemen İzle
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button 
              v-if="!hasRunnerUps"
              @click="closeMatch"
              class="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 ring-1 ring-white/10 transition-all active:scale-95"
            >
              Odadan Çık
            </button>
          </div>
        </div>
      </div>

      <!-- Runner Ups List -->
      <div v-if="hasRunnerUps" class="space-y-4 mb-12">
        <h4 class="text-xl font-bold mb-6 flex items-center gap-3">
          <span class="text-white/50">Diğer Eşleşmeler</span>
          <div class="h-px bg-white/10 flex-1"></div>
        </h4>
        
        <div 
          v-for="(match, index) in runnerUps" 
          :key="match.tmdb_id || index"
          class="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-6 hover:bg-white/10 transition-colors group cursor-pointer"
          @click="goToDetails(match)"
        >
          <div class="text-2xl font-black text-white/20 pl-4 w-12">#{{ index + 2 }}</div>
          
          <div class="w-16 h-24 rounded-xl overflow-hidden shrink-0 bg-white/5">
            <img 
              v-if="match.poster_path"
              :src="`https://image.tmdb.org/t/p/w154${match.poster_path}`" 
              class="w-full h-full object-cover"
            />
          </div>
          
          <div class="flex-1">
            <h5 class="text-lg font-bold mb-1 group-hover:text-amber-400 transition-colors">{{ match.title }}</h5>
            <div class="flex items-center gap-3 text-sm text-white/50">
              <span class="flex items-center gap-1 text-amber-500/80">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                {{ match.vote_average?.toFixed(1) || '-' }}
              </span>
              <span>•</span>
              <span>{{ match.release_year || match.release_date?.substring(0,4) || '-' }}</span>
            </div>
          </div>
          
          <div class="pr-6 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>

      <!-- General Return Button if runner-ups exist or no match at all -->
      <div v-if="hasRunnerUps || !hasMatches" class="flex justify-center pb-20">
        <button 
          @click="closeMatch"
          class="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 ring-1 ring-white/10 transition-all active:scale-95"
        >
          Odadan Çık ve Yeni Kur
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
})

const roomStore = useRoomStore()

const hasMatches = computed(() => props.results && props.results.length > 0)
const topMatch = computed(() => hasMatches.value ? props.results[0] : null)
const runnerUps = computed(() => hasMatches.value ? props.results.slice(1) : [])
const hasRunnerUps = computed(() => runnerUps.value.length > 0)

const goToDetails = (match) => {
  if (!match) return
  const id = match.tmdb_id || match.id
  const type = match.content_type || 'movie' // or detect based on store state
  navigateTo(`/${type}/${id}`)
}

const closeMatch = () => {
  roomStore.resetRoom()
  navigateTo('/room')
}

const getConfettiStyle = (n) => {
  const left = Math.random() * 100
  const duration = 2 + Math.random() * 3
  const delay = Math.random() * 5
  const size = 10 + Math.random() * 20
  const colors = ['#f59e0b', '#fbbf24', '#fef3c7', '#ffffff']
  
  return {
    left: `${left}%`,
    top: '-5%',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}
.confetti {
  position: absolute;
  animation: confetti-fall linear infinite;
  border-radius: 4px;
}

@keyframes match-reveal {
  0% { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
.animate-match-reveal {
  animation: match-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
