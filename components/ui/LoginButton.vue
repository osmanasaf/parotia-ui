<template>
  <div>
    <!-- Logged in -->
    <div v-if="isLoggedIn" class="relative" data-dropdown>
      <!-- User Avatar Button -->
      <button
        @click="toggleDropdown"
        class="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        <!-- User Avatar -->
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-sm">
            {{ username.charAt(0).toUpperCase() }}
          </span>
        </div>
        
        <!-- Username -->
        <span class="font-medium">{{ username }}</span>
        
        <!-- Dropdown Arrow -->
        <svg 
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50"
        >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-white/10">
          <p class="text-white font-medium">{{ username }}</p>
          <p class="text-white/60 text-sm">{{ email }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <!-- Watchlist -->
          <button
            @click="goToWatchlist"
            class="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span>İzleme Listem</span>
          </button>

          <!-- Settings -->
          <button
            @click="goToSettings"
            class="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>Ayarlar</span>
          </button>

          <!-- Divider -->
          <div class="border-t border-white/10 my-1"></div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Çıkış yap</span>
          </button>
        </div>
      </div>
      </Transition>
    </div>

    <!-- Logged out -->
    <button
      v-else
      @click="openLoginModal"
      class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
    >
      Giriş Yap
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUIStore } from '~/stores/ui'

const { isLoggedIn, currentUser, logout } = useAuth()
const uiStore = useUIStore()

const username = computed(() => currentUser.value?.username || '')
const email = computed(() => currentUser.value?.email || '')
const isDropdownOpen = ref(false)

const openLoginModal = () => {
  uiStore.openLoginModal()
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = () => {
  logout()
  closeDropdown()
}

const goToWatchlist = () => {
  // Watchlist sayfasına yönlendir
  navigateTo('/watchlist')
  closeDropdown()
}

const goToSettings = () => {
  // Ayarlar sayfasına yönlendir
  navigateTo('/settings')
  closeDropdown()
}

// Dropdown dışına tıklandığında kapat
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('[data-dropdown]')
  if (!dropdown) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 