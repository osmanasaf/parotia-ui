<template>
  <nav class="navbar-modern sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="block focus:outline-none">
              <Logo size="md" />
            </NuxtLink>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-6">
            <NuxtLink
              to="/movie"
              class="font-medium transition-colors duration-200"
              :class="isMoviesActive ? 'text-[#F5A623]' : 'text-white/70 hover:text-[#F5A623]'"
            >
              Filmler
            </NuxtLink>
            <NuxtLink
              to="/tv"
              class="font-medium transition-colors duration-200"
              :class="isTVActive ? 'text-[#F5A623]' : 'text-white/70 hover:text-[#F5A623]'"
            >
              Diziler
            </NuxtLink>
            <NuxtLink
              to="/room"
              class="font-medium transition-colors duration-200 flex items-center gap-2"
              :class="isRoomActive ? 'text-[#F5A623]' : 'text-white/70 hover:text-[#F5A623]'"
            >
              Sinema Odası
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">BETA</span>
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
import Logo from '~/components/ui/Logo.vue'

const route = useRoute()
const isMoviesActive = computed(() => route.path.startsWith('/movie'))
const isTVActive = computed(() => route.path.startsWith('/tv'))
const isRoomActive = computed(() => route.path.startsWith('/room'))
</script> 