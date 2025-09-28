<template>
  <div class="flex flex-col items-center justify-center select-none" role="status" :aria-label="ariaLabel">
    <svg :class="iconClass" viewBox="0 0 120 120" fill="none">
      <!-- Film reel -->
      <g class="origin-center animate-spin-slow">
        <circle cx="60" cy="60" r="40" stroke="url(#g1)" stroke-width="8" fill="#0b1220"/>
        <circle v-for="i in 8" :key="i"
                :cx="60 + 28 * Math.cos((i-1) * Math.PI/4)"
                :cy="60 + 28 * Math.sin((i-1) * Math.PI/4)"
                r="4" fill="#fff" fill-opacity="0.9"/>
      </g>

      <!-- Film strip (sweep) -->
      <g class="animate-film-strip">
        <rect x="-60" y="55" width="240" height="10" fill="url(#g2)" opacity="0.35"/>
      </g>

      <!-- Clapboard
      -->
      <g class="animate-clapboard" transform="translate(78,22)">
        <rect x="0" y="18" width="24" height="16" rx="2" fill="#1f2937"/>
        <path d="M0 18 L24 18 L21 10 L-3 10 Z" fill="#374151"/>
        <path d="M1 12 L4 12 M7 12 L10 12 M13 12 L16 12 M19 12 L22 12" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      </g>

      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="50%" stop-color="#EC4899"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
    </svg>
    <p v-if="label" class="mt-3 text-white/70 text-sm">{{ label }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Yükleniyor' }
})

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20'
}
const iconClass = computed(() => sizeMap[props.size] || sizeMap.md)
</script>

<style scoped>
.animate-spin-slow { animation: spin 2.4s linear infinite; }
.animate-film-strip { animation: film 1.2s linear infinite; }
.animate-clapboard { transform-origin: 90px 32px; animation: clap 1.6s ease-in-out infinite; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes film {
  0% { transform: translateX(0); }
  100% { transform: translateX(-30px); }
}
@keyframes clap {
  0%, 100% { transform: translate(78px,22px) rotate(0deg); }
  50% { transform: translate(78px,22px) rotate(-10deg); }
}
</style>


