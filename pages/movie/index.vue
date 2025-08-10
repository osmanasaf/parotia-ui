<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />

    <HeroBackdropCarousel
      v-if="heroItems.length"
      :items="heroItems"
      @select="handleSelect"
      @more="handleSelect"
    />

    <div class="space-y-6">
      <GenreSection
        v-for="section in sections"
        :key="section.id"
        :title="section.name"
        :items="section.items"
        content-type="movie"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import HeroBackdropCarousel from '~/components/ui/HeroBackdropCarousel.vue'
import GenreSection from '~/components/ui/GenreSection.vue'

const contentStore = useContentStore()
const { loadPopularMovies, loadGenresWithContent, navigateToContent } = useContent()

const sections = computed(() => contentStore.genreSectionsByType.movie || [])

const heroItems = computed(() => {
  // Popülerleri backdrop için kullan; eğer yoksa ilk section'dan al
  const flat = sections.value.flatMap(s => s.items || [])
  return flat
    .filter(i => i.backdropPath || i.backdrop_path)
    .slice(0, 8)
    .map(i => ({
      id: i.id,
      title: i.title,
      overview: i.overview,
      backdropPath: i.backdropPath || i.backdrop_path
    }))
})

const handleSelect = (item) => {
  navigateToContent({ id: item.id, media_type: 'movie' })
}

onMounted(async () => {
  await Promise.all([
    loadPopularMovies(),
    loadGenresWithContent('movie')
  ])
})

useHead({ title: 'Filmler - Parotia' })
</script>


