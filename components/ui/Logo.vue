<template>
  <div :class="['inline-flex items-center select-none', wrapperClass]" aria-label="movAi logo">
    <svg
      :class="['shrink-0', iconClass]"
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="50%" stop-color="#EC4899"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#g1)" opacity="0.95" filter="url(#glow)"/>
      <circle cx="32" cy="32" r="23" fill="#000" fill-opacity="0.25"/>
      <path d="M28 22L44 32L28 42V22Z" fill="#fff" fill-opacity="0.92"/>
      <path d="M24 20C24 18.8954 24.8954 18 26 18H30C31.1046 18 32 18.8954 32 20V44C32 45.1046 31.1046 46 30 46H26C24.8954 46 24 45.1046 24 44V20Z" fill="#fff" fill-opacity="0.12"/>
    </svg>
    <span :class="['ml-2 font-extrabold tracking-tight', textClass]">
      <span class="text-white">mov</span><span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300">Ai</span>
    </span>
  </div>
  
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: 'md' } // 'sm' | 'md' | 'lg'
})

const sizeToClasses = {
  sm: { icon: 'w-6 h-6', text: 'text-lg', wrap: '' },
  md: { icon: 'w-8 h-8', text: 'text-2xl', wrap: '' },
  lg: { icon: 'w-10 h-10', text: 'text-3xl', wrap: '' }
}

const current = computed(() => sizeToClasses[props.size] || sizeToClasses.md)
const iconClass = computed(() => current.value.icon)
const textClass = computed(() => current.value.text)
const wrapperClass = computed(() => current.value.wrap)
</script>

<style scoped>
</style>



