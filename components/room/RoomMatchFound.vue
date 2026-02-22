<template>
  <div class="relative z-50 flex items-center justify-center p-6 bg-transparent min-h-[80vh] overflow-hidden">
    <!-- Confetti / Particles Background -->
    <div class="absolute inset-0 pointer-events-none opacity-50">
      <div v-for="n in 30" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
    </div>

    <div class="max-w-4xl w-full relative animate-match-reveal">
      <div class="text-center mb-12">
        <div class="inline-block px-4 py-1 bg-amber-500 text-black text-xs font-black rounded-full uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(245,158,11,0.5)]">EŞLEŞME BULUNDU!</div>
        <h2 class="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">İşte Ortak Kararınız</h2>
      </div>

      <div class="bg-[var(--bg-secondary)] rounded-[48px] border border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row shadow-amber-500/5">
        <div class="w-full md:w-2/5 aspect-[2/3]">
          <NuxtImg 
            :src="`https://image.tmdb.org/t/p/w780${match.poster_path}`"
            :alt="match.title"
            class="w-full h-full object-cover"
          />
        </div>
        
        <div class="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h3 class="text-4xl font-bold mb-6">{{ match.title }}</h3>
          
          <div class="flex flex-wrap items-center gap-4 mb-8">
            <div class="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl font-bold border border-amber-500/20">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              {{ match.vote_average?.toFixed(1) }}
            </div>
            <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 font-medium">
              {{ match.release_year || match.release_date?.substring(0,4) }}
            </div>
            <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 font-medium">
              {{ match.content_type || 'Movie' }}
            </div>
          </div>

          <p class="text-lg text-white/60 leading-relaxed mb-10 line-clamp-4 italic">
            "{{ match.overview }}"
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="goToDetails"
              class="flex-1 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Hemen İzle
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button 
              @click="closeMatch"
              class="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 ring-1 ring-white/10 transition-all active:scale-95"
            >
              Odadan Çık
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  match: Object
})

const roomStore = useRoomStore()

const goToDetails = () => {
  const id = props.match.tmdb_id || props.match.id
  const type = props.match.content_type || 'movie'
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
  0% { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
.animate-match-reveal {
  animation: match-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
