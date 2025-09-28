<template>
  <div class="flex flex-col items-center justify-center select-none" role="status" :aria-label="ariaLabel">
    <svg :class="iconClass" viewBox="0 0 120 120" fill="none">
      <!-- Projector body -->
      <g transform="translate(22,42)">
        <!-- Reels -->
        <g class="animate-reel">
          <circle cx="20" cy="18" r="14" fill="#0f172a" stroke="url(#g1)" stroke-width="3"/>
          <circle v-for="i in 6" :key="`r1-`+i" :cx="20 + 8*Math.cos((i-1)*Math.PI/3)" :cy="18 + 8*Math.sin((i-1)*Math.PI/3)" r="2" fill="#e5e7eb"/>
        </g>
        <g class="animate-reel" transform="translate(32,0)">
          <circle cx="20" cy="18" r="14" fill="#0f172a" stroke="url(#g1)" stroke-width="3"/>
          <circle v-for="i in 6" :key="`r2-`+i" :cx="20 + 8*Math.cos((i-1)*Math.PI/3)" :cy="18 + 8*Math.sin((i-1)*Math.PI/3)" r="2" fill="#e5e7eb"/>
        </g>
        <!-- Body -->
        <rect x="8" y="30" width="56" height="22" rx="6" fill="#111827" stroke="#1f2937"/>
        <!-- Lens -->
        <circle cx="72" cy="41" r="6" fill="#111827" stroke="url(#g1)" stroke-width="2"/>
      </g>

      <!-- Light beam -->
      <g class="animate-beam">
        <polygon points="74,60 120,42 120,78" fill="url(#beam)" opacity="0.55"/>
      </g>

      <!-- Floating dust in beam -->
      <g class="animate-dust">
        <circle cx="96" cy="60" r="1.2" fill="#fff" fill-opacity="0.7"/>
        <circle cx="104" cy="54" r="0.9" fill="#fff" fill-opacity="0.6"/>
        <circle cx="110" cy="66" r="1" fill="#fff" fill-opacity="0.5"/>
      </g>

      <!-- Film strip indicator -->
      <g class="animate-film-strip">
        <rect x="-40" y="90" width="240" height="6" fill="url(#g2)" opacity="0.35"/>
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
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
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
.animate-reel { animation: spin 1.8s linear infinite; transform-origin: 42px 60px; }
.animate-film-strip { animation: film 1.2s linear infinite; }
.animate-beam { animation: beamFlicker 1.6s ease-in-out infinite; }
.animate-dust { animation: dust 3.2s linear infinite; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes film { 0% { transform: translateX(0); } 100% { transform: translateX(-24px); } }
@keyframes beamFlicker {
  0%, 100% { opacity: 0.55; }
  40% { opacity: 0.75; }
  60% { opacity: 0.45; }
}
@keyframes dust {
  0% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-4px); opacity: 0.9; }
  100% { transform: translateY(0); opacity: 0.6; }
}
</style>


