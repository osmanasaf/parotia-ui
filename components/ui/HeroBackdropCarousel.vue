<template>
  <div class="relative w-full overflow-hidden">
    <div class="relative h-[55vh] md:h-[70vh]">
      <transition-group name="fade" tag="div">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          v-show="currentIndex === index"
          class="absolute inset-0">
          <NuxtImg
            v-if="item.backdropPath"
            :src="`https://image.tmdb.org/t/p/original${item.backdropPath}`"
            :alt="item.title || item.name"
            class="w-full h-full object-cover"
            format="webp"
            sizes="100vw"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-6xl">
            <h2 class="text-3xl md:text-5xl font-bold text-white drop-shadow">{{ item.title || item.name }}</h2>
            <p class="hidden md:block mt-4 text-white/80 line-clamp-3 max-w-3xl">{{ item.overview }}</p>
            <div class="mt-4 flex items-center gap-3">
              <button @click="$emit('select', item)" class="px-4 py-2 rounded bg-white text-black font-semibold hover:bg-white/90">İzle</button>
              <button @click="$emit('more', item)" class="px-4 py-2 rounded bg-white/20 text-white font-semibold hover:bg-white/30">Detay</button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(item, index) in items"
        :key="`dot-${item.id}`"
        class="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white"
        :class="{ 'bg-white': index === currentIndex }"
        @click="goTo(index)"
        aria-label="slide-dot"
      />
    </div>

    <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2">‹</button>
    <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2">›</button>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  autoplayMs: { type: Number, default: 5000 }
})

const emit = defineEmits(['select', 'more'])

const currentIndex = ref(0)
let timer = null

const next = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prev = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
}

const goTo = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  timer = setInterval(next, props.autoplayMs)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


