<template>
  <div class="group relative cursor-pointer" @click="$emit('click')">
    <div class="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-2xl">
      <NuxtImg
        v-if="backdropSrc"
        :src="`https://image.tmdb.org/t/p/w780${backdropSrc}`"
        :alt="title"
        class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl" />

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-white font-semibold truncate">{{ title }}</h3>
          <div class="flex items-center gap-1 text-yellow-400 text-sm">
            <span>⭐</span>
            <span class="text-white/90">{{ ratingDisplay }}</span>
          </div>
        </div>
        <p class="mt-2 text-white/85 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{{ overview }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  rating: { type: Number, default: null },
  overview: { type: String, default: '' },
  backdrop: { type: String, default: null },
  poster: { type: String, default: null }
})

const ratingDisplay = computed(() => props.rating ? props.rating.toFixed(1) : '—')
const backdropSrc = computed(() => props.backdrop || props.poster)
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>


