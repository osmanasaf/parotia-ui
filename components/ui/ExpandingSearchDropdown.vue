<template>
  <div class="expanding-search-dropdown" @click.stop>
    <!-- Header with Country Selector -->
    <div class="search-dropdown-header">
      <div class="search-dropdown-title">ARAMA AYARLARI</div>
      <div class="country-selector-container">
        <div class="country-selector-modern" @click="toggleCountryDropdown">
          <div class="country-flag">{{ getCountryFlag(selectedCountry) }}</div>
          <div class="country-info">
            <div class="country-code">{{ selectedCountry }}</div>
            <div class="country-name">{{ getCountryName(selectedCountry) }}</div>
          </div>
          <div class="country-arrow" :class="{ 'rotated': showCountryDropdown }">▼</div>
        </div>
        
        <!-- Country Dropdown -->
        <div v-if="showCountryDropdown" class="country-dropdown">
          <div class="country-dropdown-header">
            <div class="country-dropdown-title">Ülke Seçin</div>
            <button @click="toggleCountryDropdown" class="close-country-btn">✕</button>
          </div>
          <div class="country-list">
            <div 
              v-for="country in popularCountries" 
              :key="country.code"
              @click="selectCountry(country.code)"
              class="country-item"
              :class="{ 'selected': selectedCountry === country.code }"
            >
              <div class="country-item-flag">{{ country.flag }}</div>
              <div class="country-item-info">
                <div class="country-item-code">{{ country.code }}</div>
                <div class="country-item-name">{{ country.name }}</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Recent Searches -->
    <div v-if="!searchQuery && recentSearches.length > 0" class="recent-searches-section">
      <div class="recent-searches-title">
        Son aramalar
        <button @click="clearRecentSearches" class="clear-recent-btn">Tümünü temizle</button>
      </div>
      <div class="recent-searches-grid">
        <div 
          v-for="search in recentSearches.slice(0, 6)" 
          :key="search.id"
          @click.stop="handleRecentClick(search)"
          class="recent-search-item"
        >
          <NuxtImg 
            :src="search.poster ? `https://image.tmdb.org/t/p/w200${search.poster}` : '/placeholder-movie.jpg'" 
            :alt="search.title"
            class="recent-search-poster"
            loading="lazy"
          />
          <div class="recent-search-title">{{ search.title }}</div>
        </div>
      </div>
    </div>

     <!-- Search Results -->
     <div v-if="searchQuery && searchResults.length > 0" class="search-results-dropdown">
       <div 
         v-for="result in searchResults.slice(0, 5)" 
         :key="result.tmdb_id"
         class="search-result-dropdown-item-wrapper"
       >
         <div 
           class="search-result-dropdown-item"
           @click="handleResultClick(result)"
         >
           <NuxtImg 
             :src="result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : '/placeholder-movie.jpg'" 
             :alt="result.title"
             class="search-result-dropdown-poster"
             loading="lazy"
           />
           <div class="search-result-dropdown-info">
             <div class="search-result-dropdown-title">{{ result.title }}</div>
             <div class="search-result-dropdown-meta">{{ result.year }} • {{ result.content_type || result.type }}</div>
           </div>
           <div class="search-result-dropdown-type">{{ result.content_type || result.type }}</div>
         </div>

         <!-- Inline providers panel under the selected result -->
         <div 
           v-if="selectedResultId === result.tmdb_id && !providersLoading && selectedProviders.length > 0"
           class="providers-inline"
         >
           <div class="providers-inline-title">Şurada mevcut</div>
           <div class="providers-inline-grid">
             <div 
               v-for="provider in selectedProviders" 
               :key="provider.id"
               class="provider-dropdown-item"
             >
               <NuxtImg
                 v-if="provider.logo && provider.logo[0] === '/'"
                 :src="`https://image.tmdb.org/t/p/w45${provider.logo}`"
                 :alt="provider.name"
                 width="24"
                 height="24"
                 class="provider-logo-img"
                 loading="lazy"
               />
               <div v-else class="provider-logo-fallback" :style="{backgroundColor: provider.color}">
                 {{ provider.name?.[0] || '?' }}
               </div>
               <span class="provider-dropdown-name">{{ provider.name }}</span>
             </div>
           </div>
         </div>
         <!-- Providers loading state -->
         <div
           v-if="selectedResultId === result.tmdb_id && providersLoading"
           class="providers-inline providers-loading"
         >
           <div class="spinner" aria-label="Yükleniyor" />
         </div>
         <!-- Providers empty state -->
         <div
           v-if="selectedResultId === result.tmdb_id && !providersLoading && selectedProviders.length === 0"
           class="providers-inline providers-empty"
         >
           <div class="providers-inline-title">⚠️ Bu ülkede mevcut değil</div>
         </div>
       </div>
     </div>

     <!-- Global providers section removed; providers shown inline under selected item -->
   </div>

   <!-- Empty State - sadece arama yapıldıktan sonra göster -->
   <div v-if="searchQuery && searchResults.length === 0 && hasSearched" class="empty-dropdown-state">
     <div class="empty-dropdown-icon">🔍</div>
     <div class="empty-dropdown-text">Sonuç bulunamadı</div>
     <div class="empty-dropdown-subtext">Farklı bir başlık aramayı deneyin</div>
   </div>
</template>

<script setup>
// Dumb component - receives props and emits events
const searchStore = useSearchStore()
const contentStore = useContentStore()
const { selectSearchResult, selectRecentSearch, clearRecentSearches, setSearchCountry } = useSearch()

const searchQuery = computed(() => searchStore.expandingSearchQuery)
const searchResults = computed(() => searchStore.expandingSearchResults)
const selectedProviders = computed(() => searchStore.selectedExpandingSearchProviders)
const selectedResultId = ref(null)
const recentSearches = computed(() => contentStore.recentSearches)
const providersLoading = ref(false)
const providersLoadedForId = ref(null)

// Arama yapılıp yapılmadığını takip et
const hasSearched = ref(false)

// Arama yapıldığında flag'i true yap
watch(searchResults, (newResults) => {
  if (searchQuery.value.trim().length >= 3 && newResults.length === 0) {
    hasSearched.value = true
  } else if (newResults.length > 0) {
    hasSearched.value = false
  }
})

// Arama query'si değiştiğinde flag'i sıfırla
watch(searchQuery, (newQuery) => {
  if (newQuery.trim().length < 3) {
    hasSearched.value = false
  }
})
const handleResultClick = async (result) => {
  selectedResultId.value = result.tmdb_id ?? result.id
  // Eski provider listesini hemen temizle ki boş/loader durumları doğru görünsün
  searchStore.setSelectedExpandingSearchProviders([])
  providersLoading.value = true
  providersLoadedForId.value = null
  await selectSearchResult(result)
  providersLoading.value = false
  providersLoadedForId.value = result.tmdb_id ?? result.id
}

const handleRecentClick = async (search) => {
  // Arama input'unu güncelle
  searchStore.setExpandingSearchQuery(search.title)
  // UI: loader ve seçim kimliğini ayarla
  selectedResultId.value = search.id
  searchStore.setSelectedExpandingSearchProviders([])
  providersLoading.value = true
  providersLoadedForId.value = null
  // Mevcut composable akışını kullanarak provider çek
  await selectRecentSearch(search)
  providersLoading.value = false
  providersLoadedForId.value = search.id
}



const selectedCountry = computed({
  get: () => searchStore.expandingSearchCountry,
  set: (value) => setSearchCountry(value)
})

const showCountryDropdown = ref(false)

const popularCountries = [
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'US', name: 'Amerika', flag: '🇺🇸' },
  { code: 'GB', name: 'İngiltere', flag: '🇬🇧' },
  { code: 'DE', name: 'Almanya', flag: '🇩🇪' },
  { code: 'FR', name: 'Fransa', flag: '🇫🇷' },
  { code: 'IT', name: 'İtalya', flag: '🇮🇹' },
  { code: 'ES', name: 'İspanya', flag: '🇪🇸' },
  { code: 'NL', name: 'Hollanda', flag: '🇳🇱' },
  { code: 'BE', name: 'Belçika', flag: '🇧🇪' },
  { code: 'AT', name: 'Avusturya', flag: '🇦🇹' },
  { code: 'CH', name: 'İsviçre', flag: '🇨🇭' },
  { code: 'SE', name: 'İsveç', flag: '🇸🇪' },
  { code: 'NO', name: 'Norveç', flag: '🇳🇴' },
  { code: 'DK', name: 'Danimarka', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandiya', flag: '🇫🇮' },
  { code: 'PL', name: 'Polonya', flag: '🇵🇱' },
  { code: 'CZ', name: 'Çek Cumhuriyeti', flag: '🇨🇿' },
  { code: 'HU', name: 'Macaristan', flag: '🇭🇺' },
  { code: 'RO', name: 'Romanya', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaristan', flag: '🇧🇬' },
  { code: 'HR', name: 'Hırvatistan', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovenya', flag: '🇸🇮' },
  { code: 'SK', name: 'Slovakya', flag: '🇸🇰' },
  { code: 'LT', name: 'Litvanya', flag: '🇱🇹' },
  { code: 'LV', name: 'Letonya', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonya', flag: '🇪🇪' },
  { code: 'CA', name: 'Kanada', flag: '🇨🇦' },
  { code: 'AU', name: 'Avustralya', flag: '🇦🇺' },
  { code: 'NZ', name: 'Yeni Zelanda', flag: '🇳🇿' },
  { code: 'BR', name: 'Brezilya', flag: '🇧🇷' },
  { code: 'AR', name: 'Arjantin', flag: '🇦🇷' },
  { code: 'MX', name: 'Meksika', flag: '🇲🇽' },
  { code: 'CL', name: 'Şili', flag: '🇨🇱' },
  { code: 'CO', name: 'Kolombiya', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'EC', name: 'Ekvador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivya', flag: '🇧🇴' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'SR', name: 'Surinam', flag: '🇸🇷' },
  { code: 'GF', name: 'Fransız Guyanası', flag: '🇬🇫' },
  { code: 'FK', name: 'Falkland Adaları', flag: '🇫🇰' },
  { code: 'JP', name: 'Japonya', flag: '🇯🇵' },
  { code: 'KR', name: 'Güney Kore', flag: '🇰🇷' },
  { code: 'CN', name: 'Çin', flag: '🇨🇳' },
  { code: 'IN', name: 'Hindistan', flag: '🇮🇳' },
  { code: 'TH', name: 'Tayland', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MY', name: 'Malezya', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'ID', name: 'Endonezya', flag: '🇮🇩' },
  { code: 'PH', name: 'Filipinler', flag: '🇵🇭' },
  { code: 'TW', name: 'Tayvan', flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'MO', name: 'Makao', flag: '🇲🇴' },
  { code: 'RU', name: 'Rusya', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukrayna', flag: '🇺🇦' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'GE', name: 'Gürcistan', flag: '🇬🇪' },
  { code: 'AM', name: 'Ermenistan', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaycan', flag: '🇦🇿' },
  { code: 'KZ', name: 'Kazakistan', flag: '🇰🇿' },
  { code: 'UZ', name: 'Özbekistan', flag: '🇺🇿' },
  { code: 'KG', name: 'Kırgızistan', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tacikistan', flag: '🇹🇯' },
  { code: 'TM', name: 'Türkmenistan', flag: '🇹🇲' },
  { code: 'AF', name: 'Afganistan', flag: '🇦🇫' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladeş', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'MV', name: 'Maldivler', flag: '🇲🇻' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'KH', name: 'Kamboçya', flag: '🇰🇭' },
  { code: 'MN', name: 'Moğolistan', flag: '🇲🇳' },
  { code: 'KP', name: 'Kuzey Kore', flag: '🇰🇵' },
  { code: 'IL', name: 'İsrail', flag: '🇮🇱' },
  { code: 'LB', name: 'Lübnan', flag: '🇱🇧' },
  { code: 'SY', name: 'Suriye', flag: '🇸🇾' },
  { code: 'JO', name: 'Ürdün', flag: '🇯🇴' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'IR', name: 'İran', flag: '🇮🇷' },
  { code: 'KW', name: 'Kuveyt', flag: '🇰🇼' },
  { code: 'SA', name: 'Suudi Arabistan', flag: '🇸🇦' },
  { code: 'AE', name: 'Birleşik Arap Emirlikleri', flag: '🇦🇪' },
  { code: 'QA', name: 'Katar', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahreyn', flag: '🇧🇭' },
  { code: 'OM', name: 'Umman', flag: '🇴🇲' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'EG', name: 'Mısır', flag: '🇪🇬' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'TN', name: 'Tunus', flag: '🇹🇳' },
  { code: 'DZ', name: 'Cezayir', flag: '🇩🇿' },
  { code: 'MA', name: 'Fas', flag: '🇲🇦' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SS', name: 'Güney Sudan', flag: '🇸🇸' },
  { code: 'ET', name: 'Etiyopya', flag: '🇪🇹' },
  { code: 'ER', name: 'Eritre', flag: '🇪🇷' },
  { code: 'DJ', name: 'Cibuti', flag: '🇩🇯' },
  { code: 'SO', name: 'Somali', flag: '🇸🇴' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzanya', flag: '🇹🇿' },
  { code: 'RW', name: 'Ruanda', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'MZ', name: 'Mozambik', flag: '🇲🇿' },
  { code: 'ZW', name: 'Zimbabve', flag: '🇿🇼' },
  { code: 'ZM', name: 'Zambiya', flag: '🇿🇲' },
  { code: 'MW', name: 'Malavi', flag: '🇲🇼' },
  { code: 'BW', name: 'Botsvana', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibya', flag: '🇳🇦' },
  { code: 'ZA', name: 'Güney Afrika', flag: '🇿🇦' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'MG', name: 'Madagaskar', flag: '🇲🇬' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'SC', name: 'Seyşeller', flag: '🇸🇨' },
  { code: 'KM', name: 'Komorlar', flag: '🇰🇲' },
  { code: 'TD', name: 'Çad', flag: '🇹🇩' },
  { code: 'CF', name: 'Orta Afrika Cumhuriyeti', flag: '🇨🇫' },
  { code: 'CM', name: 'Kamerun', flag: '🇨🇲' },
  { code: 'GQ', name: 'Ekvator Ginesi', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'CG', name: 'Kongo Cumhuriyeti', flag: '🇨🇬' },
  { code: 'CD', name: 'Demokratik Kongo Cumhuriyeti', flag: '🇨🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'ST', name: 'São Tomé ve Príncipe', flag: '🇸🇹' },
  { code: 'GW', name: 'Gine-Bissau', flag: '🇬🇼' },
  { code: 'GN', name: 'Gine', flag: '🇬🇳' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'LR', name: 'Liberya', flag: '🇱🇷' },
  { code: 'CI', name: 'Fildişi Sahili', flag: '🇨🇮' },
  { code: 'GH', name: 'Gana', flag: '🇬🇭' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'NG', name: 'Nijerya', flag: '🇳🇬' },
  { code: 'NE', name: 'Nijer', flag: '🇳🇪' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'GM', name: 'Gambiya', flag: '🇬🇲' },
  { code: 'CV', name: 'Yeşil Burun', flag: '🇨🇻' },
  { code: 'MR', name: 'Moritanya', flag: '🇲🇷' },
  { code: 'EH', name: 'Batı Sahra', flag: '🇪🇭' }
]

const toggleCountryDropdown = () => {
  showCountryDropdown.value = !showCountryDropdown.value
}

const selectCountry = (countryCode) => {
  selectedCountry.value = countryCode
  showCountryDropdown.value = false
}

const getCountryFlag = (code) => {
  const country = popularCountries.find(c => c.code === code)
  return country ? country.flag : '🌍'
}

const getCountryName = (code) => {
  const country = popularCountries.find(c => c.code === code)
  return country ? country.name : 'Unknown'
}

// Click outside handler
onMounted(() => {
  const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.country-selector-container')
    if (dropdown && !dropdown.contains(event.target)) {
      showCountryDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script> 