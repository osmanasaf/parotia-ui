<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-2xl md:text-3xl font-bold text-white">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <button @click="scroll('left')" class="bg-white/10 hover:bg-white/20 text-white rounded p-2">‹</button>
        <button @click="scroll('right')" class="bg-white/10 hover:bg-white/20 text-white rounded p-2">›</button>
      </div>
    </div>
    <div ref="list" class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
      <component
        :is="cardComponent"
        v-for="item in items"
        :key="item.id"
        v-bind="cardProps(item)"
        @click="$emit('select', item)"
      />
    </div>
  </section>
  
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, default: () => [] },
  contentType: { type: String, default: 'movie' }
})

const list = ref(null)

import MovieCard from '~/components/ui/MovieCard.vue'
import TVShowCard from '~/components/ui/TVShowCard.vue'

const cardComponent = computed(() => (props.contentType === 'tv' ? TVShowCard : MovieCard))

const cardProps = (item) => {
  if (props.contentType === 'tv') return { show: { id: item.id, name: item.title || item.name, poster: item.posterPath || item.poster_path, rating: item.rating || item.vote_average } }
  return { movie: { id: item.id, title: item.title || item.name, poster: item.posterPath || item.poster_path, rating: item.rating || item.vote_average } }
}

const scroll = (dir) => {
  if (!list.value) return
  const delta = dir === 'left' ? -400 : 400
  list.value.scrollBy({ left: delta, behavior: 'smooth' })
}

defineEmits(['select'])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>


