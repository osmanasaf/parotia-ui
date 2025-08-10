<template>
  <nav class="navbar-modern sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="block focus:outline-none">
              <h1 class="text-3xl font-bold font-space text-gradient">
                🐦 PAROTIA
              </h1>
            </NuxtLink>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-6">
            <NuxtLink
              to="/movie"
              class="font-medium transition-colors"
              :class="isMoviesActive ? 'text-white' : 'text-white/80 hover:text-white'"
            >
              Movies
            </NuxtLink>
            <NuxtLink
              to="/tv"
              class="font-medium transition-colors"
              :class="isTVActive ? 'text-white' : 'text-white/80 hover:text-white'"
            >
              TV Shows
            </NuxtLink>
            <ExpandingSearch />
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Smart component - handles layout logic
import ExpandingSearch from '~/components/ui/ExpandingSearch.vue'
import LoginButton from '~/components/ui/LoginButton.vue'

const route = useRoute()
const isMoviesActive = computed(() => route.path.startsWith('/movie'))
const isTVActive = computed(() => route.path.startsWith('/tv'))
</script> 