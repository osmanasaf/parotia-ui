<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      variant === 'primary' && 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500',
      variant === 'secondary' && 'bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/50',
      variant === 'danger' && 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-500',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
    ]"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      {{ loadingText }}
    </div>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  }
})

defineEmits(['click'])
</script> 