<template>
  <div v-if="open" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="close">
    <div class="max-w-[90vw] w-[420px] rounded-2xl bg-neutral-900/95 ring-1 ring-white/10 shadow-2xl p-5 overflow-hidden">
      <div class="flex items-center justify-between mb-3">
        <h5 class="text-white font-semibold text-lg">Rate</h5>
        <button class="text-white/60 hover:text-white" @click="close" aria-label="Close">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <button
            v-for="n in 10"
            :key="`star-${n}`"
            class="p-1"
            @mouseenter="hover = n"
            @mouseleave="hover = 0"
            @click="$emit('update:modelValue', n)"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" :fill="(hover || modelValue) >= n ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="2">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        </div>
        <span class="text-white/90 text-sm font-medium ml-3">{{ hover || modelValue }}/10</span>
      </div>
      <textarea v-model="commentLocal" placeholder="Optional comment" class="mt-4 w-full min-h-24 p-3 rounded-lg bg-neutral-800 text-white placeholder-white/50 ring-1 ring-white/10 focus:outline-none" />
      <div class="mt-4 flex gap-2 justify-end">
        <button class="px-3 py-1.5 rounded-md text-white bg-white/10 hover:bg-white/20" @click="close">Cancel</button>
        <button class="px-3 py-1.5 rounded-md text-white bg-indigo-600 hover:bg-indigo-500" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  modelValue: { type: Number, default: 7 },
  comment: { type: String, default: '' }
})

const emit = defineEmits(['update:open', 'update:modelValue', 'save'])
const hover = ref(0)
const commentLocal = ref(props.comment)

const close = () => emit('update:open', false)
const save = () => emit('save', { rating: props.modelValue, comment: commentLocal.value })
</script>


