<template>
  <div class="expanding-search-container">
    <button 
      @click="toggleSearch"
      :class="['expanding-search-button', { expanded: isExpandingSearchExpanded }]"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <span v-if="!isExpandingSearchExpanded">Where to Watch</span>
      <input 
        v-model="searchQuery"
        @input="handleInput"
        @keyup.enter="handleSearchOnEnter"
        @focus="showDropdown = true"
        @blur="handleBlur"
        :class="['expanding-search-input', { expanded: isExpandingSearchExpanded }]"
        placeholder="Search for movies or TV shows"
        ref="searchInput"
      >
    </button>
    
    <ExpandingSearchDropdown 
      v-if="showDropdown"
      :class="{ show: showDropdown }"
    />
  </div>
</template>

<script setup>
// Smart component - handles search logic
import ExpandingSearchDropdown from '~/components/ui/ExpandingSearchDropdown.vue'

const searchStore = useSearchStore()
const { toggleSearch, handleSearchInput, performSearchOnEnter, handleSearchBlur } = useSearch()

const searchInput = ref(null)

const searchQuery = computed({
  get: () => searchStore.expandingSearchQuery,
  set: (value) => searchStore.setExpandingSearchQuery(value)
})

const isExpandingSearchExpanded = computed(() => searchStore.isExpandingSearchExpanded)
const showDropdown = computed({
  get: () => searchStore.showExpandingSearchDropdown,
  set: (value) => searchStore.setShowExpandingSearchDropdown(value)
})

const handleInput = (event) => {
  handleSearchInput(event.target.value)
}

const handleBlur = () => {
  handleSearchBlur()
}

const handleSearchOnEnter = () => {
  performSearchOnEnter()
}

onMounted(() => {
  const contentStore = useContentStore()
  contentStore.loadRecentSearches()
})

watch(isExpandingSearchExpanded, (expanded) => {
  if (expanded) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})
</script> 