<template>
  <nav class="navbar-modern sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-3xl font-bold font-space text-gradient">
              🐦 PAROTIA
            </h1>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-6">
            <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">Movies</a>
            <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">TV Shows</a>
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
</script> 