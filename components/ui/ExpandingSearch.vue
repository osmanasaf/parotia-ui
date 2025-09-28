<template>
  <div class="expanding-search-container">
    <div 
      :class="['expanding-search-button', { expanded: isExpandingSearchExpanded }]"
      @click="handleContainerClick"
    >
      <!-- Collapse durumunda tüm alanı tıklanabilir yapan görünmez kaplama -->
      <button
        v-if="!isExpandingSearchExpanded"
        class="search-cover-button"
        @click.stop="handleButtonClick"
        aria-label="Nerede izlenir aramasını aç"
      />
      <button 
        v-if="!isExpandingSearchExpanded"
        @click="handleButtonClick"
        class="search-icon-button"
      >
        <svg class="w-4 h-4 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
      <svg 
        v-else
        class="w-4 h-4 search-icon" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <button 
        v-if="!isExpandingSearchExpanded" 
        @click="handleButtonClick"
        class="search-button-text"
      >
        Nerede İzlenir?
      </button>
      <input 
        v-model="searchQuery"
        @keyup.enter="handleSearchOnEnter"
        @focus="handleInputFocus"
        @click="handleInputClick"
        @blur="handleBlur"
        :class="['expanding-search-input', { expanded: isExpandingSearchExpanded }]"
        placeholder="Film veya dizi ara"
        ref="searchInput"
      >
      <button 
        v-if="isExpandingSearchExpanded && searchQuery.trim().length >= 3"
        @click.stop="handleSearchClick"
        class="search-action-button"
        title="Ara"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
    </div>
    
    <ExpandingSearchDropdown 
      v-if="showDropdown"
      @click.stop
    />
  </div>
</template>

<script setup>
// Smart component - handles search logic
import ExpandingSearchDropdown from '~/components/ui/ExpandingSearchDropdown.vue'

const searchStore = useSearchStore()
const { toggleSearch, performSearchOnEnter, handleSearchBlur } = useSearch()

const searchInput = ref(null)

const searchQuery = computed({
  get: () => searchStore.expandingSearchQuery,
  set: (value) => searchStore.setExpandingSearchQuery(value)
})

const isExpandingSearchExpanded = computed(() => searchStore.isExpandingSearchExpanded)
const showDropdown = computed(() => isExpandingSearchExpanded.value)

const handleBlur = () => {
  handleSearchBlur()
}

const handleSearchOnEnter = () => {
  if (searchQuery.value.trim().length >= 3) {
    performSearchOnEnter()
  }
}

const handleSearchClick = () => {
  if (searchQuery.value.trim().length >= 3) {
    performSearchOnEnter()
  }
}

const handleButtonClick = () => {
  // Modal kapalıysa aç, açıksa kapat
  if (!isExpandingSearchExpanded.value) {
    searchStore.toggleExpandingSearch()
    // Modal açıldıktan sonra input'a focus ol
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchStore.toggleExpandingSearch()
  }
}

const handleInputFocus = () => {
  if (!isExpandingSearchExpanded.value) {
    searchStore.toggleExpandingSearch()
  }
}

const handleInputClick = () => {
  if (!isExpandingSearchExpanded.value) {
    searchStore.toggleExpandingSearch()
  }
}

// Container click: sadece kapalıyken aç, açıkken input dışında tıklama ise kapanmasın
const handleContainerClick = (event) => {
  if (!isExpandingSearchExpanded.value) {
    // Icon veya metin ya da container'ın herhangi bir yerine tıklayınca aç
    handleButtonClick()
  }
}

onMounted(() => {
  const contentStore = useContentStore()
  contentStore.loadRecentSearches()
  
  // ESC tuşu ile modal kapatma
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && isExpandingSearchExpanded.value) {
      searchStore.toggleExpandingSearch()
    }
    // Space tuşunu tamamen serbest bırak
  }
  
  // Dışına tıklayınca modal kapatma
  const handleClickOutside = (event) => {
    const container = document.querySelector('.expanding-search-container')
    if (container && !container.contains(event.target) && isExpandingSearchExpanded.value) {
      searchStore.toggleExpandingSearch()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('click', handleClickOutside)
  })
})

watch(isExpandingSearchExpanded, (expanded) => {
  if (expanded) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})
</script> 