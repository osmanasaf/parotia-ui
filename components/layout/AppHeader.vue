<template>
  <nav class="navbar-modern sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="block focus:outline-none">
            <Logo size="md" />
          </NuxtLink>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center space-x-6">
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
            class="font-medium transition-colors duration-200 flex items-center gap-1.5"
            :class="isRoomActive ? 'text-[#F5A623]' : 'text-white/70 hover:text-[#F5A623]'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Oda
          </NuxtLink>
          <ExpandingSearch />
          <LoginButton />
        </div>

        <!-- Mobile Right Side: Search + Hamburger -->
        <div class="flex md:hidden items-center gap-2">
          <NuxtLink
            to="/room"
            class="p-2 rounded-xl transition-colors"
            :class="isRoomActive ? 'text-[#F5A623]' : 'text-white/60 hover:text-[#F5A623]'"
            aria-label="Oda"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </NuxtLink>
          <button
            id="mobile-menu-btn"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
            :aria-expanded="mobileMenuOpen"
            aria-label="Menü"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/10 bg-[rgba(15,23,42,0.97)] backdrop-blur-2xl"
      >
        <div class="px-4 py-4 space-y-1">
          <NuxtLink
            to="/movie"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            :class="isMoviesActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-white/70 hover:bg-white/5 hover:text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Filmler
          </NuxtLink>
          <NuxtLink
            to="/tv"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            :class="isTVActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-white/70 hover:bg-white/5 hover:text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Diziler
          </NuxtLink>
          <NuxtLink
            to="/room"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            :class="isRoomActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-white/70 hover:bg-white/5 hover:text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ortak İzleme Odası
          </NuxtLink>
          <div class="pt-2 border-t border-white/10">
            <LoginButton @click="mobileMenuOpen = false" />
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import ExpandingSearch from '~/components/ui/ExpandingSearch.vue'
import LoginButton from '~/components/ui/LoginButton.vue'
import Logo from '~/components/ui/Logo.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const isMoviesActive = computed(() => route.path.startsWith('/movie'))
const isTVActive = computed(() => route.path.startsWith('/tv'))
const isRoomActive = computed(() => route.path.startsWith('/room'))

// Route değişince menüyü kapat
watch(() => route.path, () => { mobileMenuOpen.value = false })
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
