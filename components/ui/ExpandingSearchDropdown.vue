<template>
  <div class="expanding-search-dropdown">
    <!-- Header with Filters -->
    <div class="search-dropdown-header">
      <div class="search-dropdown-title">Search Settings</div>
      <div class="search-dropdown-filters">
        <select 
          v-model="selectedCountry" 
          class="search-dropdown-country"
        >
          <option value="TR">🇹🇷 Türkiye</option>
          <option value="US">🇺🇸 Amerika</option>
          <option value="GB">🇬🇧 İngiltere</option>
          <option value="DE">🇩🇪 Almanya</option>
          <option value="FR">🇫🇷 Fransa</option>
          <option value="IT">🇮🇹 İtalya</option>
          <option value="ES">🇪🇸 İspanya</option>
          <option value="NL">🇳🇱 Hollanda</option>
          <option value="BE">🇧🇪 Belçika</option>
          <option value="AT">🇦🇹 Avusturya</option>
          <option value="CH">🇨🇭 İsviçre</option>
          <option value="SE">🇸🇪 İsveç</option>
          <option value="NO">🇳🇴 Norveç</option>
          <option value="DK">🇩🇰 Danimarka</option>
          <option value="FI">🇫🇮 Finlandiya</option>
          <option value="PL">🇵🇱 Polonya</option>
          <option value="CZ">🇨🇿 Çek Cumhuriyeti</option>
          <option value="HU">🇭🇺 Macaristan</option>
          <option value="RO">🇷🇴 Romanya</option>
          <option value="BG">🇧🇬 Bulgaristan</option>
          <option value="HR">🇭🇷 Hırvatistan</option>
          <option value="SI">🇸🇮 Slovenya</option>
          <option value="SK">🇸🇰 Slovakya</option>
          <option value="LT">🇱🇹 Litvanya</option>
          <option value="LV">🇱🇻 Letonya</option>
          <option value="EE">🇪🇪 Estonya</option>
          <option value="CA">🇨🇦 Kanada</option>
          <option value="AU">🇦🇺 Avustralya</option>
          <option value="NZ">🇳🇿 Yeni Zelanda</option>
          <option value="BR">🇧🇷 Brezilya</option>
          <option value="AR">🇦🇷 Arjantin</option>
          <option value="MX">🇲🇽 Meksika</option>
          <option value="CL">🇨🇱 Şili</option>
          <option value="CO">🇨🇴 Kolombiya</option>
          <option value="PE">🇵🇪 Peru</option>
          <option value="VE">🇻🇪 Venezuela</option>
          <option value="UY">🇺🇾 Uruguay</option>
          <option value="PY">🇵🇾 Paraguay</option>
          <option value="EC">🇪🇨 Ekvador</option>
          <option value="BO">🇧🇴 Bolivya</option>
          <option value="GY">🇬🇾 Guyana</option>
          <option value="SR">🇸🇷 Surinam</option>
          <option value="GF">🇬🇫 Fransız Guyanası</option>
          <option value="FK">🇫🇰 Falkland Adaları</option>
          <option value="JP">🇯🇵 Japonya</option>
          <option value="KR">🇰🇷 Güney Kore</option>
          <option value="CN">🇨🇳 Çin</option>
          <option value="IN">🇮🇳 Hindistan</option>
          <option value="TH">🇹🇭 Tayland</option>
          <option value="VN">🇻🇳 Vietnam</option>
          <option value="MY">🇲🇾 Malezya</option>
          <option value="SG">🇸🇬 Singapur</option>
          <option value="ID">🇮🇩 Endonezya</option>
          <option value="PH">🇵🇭 Filipinler</option>
          <option value="TW">🇹🇼 Tayvan</option>
          <option value="HK">🇭🇰 Hong Kong</option>
          <option value="MO">🇲🇴 Makao</option>
          <option value="RU">🇷🇺 Rusya</option>
          <option value="UA">🇺🇦 Ukrayna</option>
          <option value="BY">🇧🇾 Belarus</option>
          <option value="MD">🇲🇩 Moldova</option>
          <option value="GE">🇬🇪 Gürcistan</option>
          <option value="AM">🇦🇲 Ermenistan</option>
          <option value="AZ">🇦🇿 Azerbaycan</option>
          <option value="KZ">🇰🇿 Kazakistan</option>
          <option value="UZ">🇺🇿 Özbekistan</option>
          <option value="KG">🇰🇬 Kırgızistan</option>
          <option value="TJ">🇹🇯 Tacikistan</option>
          <option value="TM">🇹🇲 Türkmenistan</option>
          <option value="AF">🇦🇫 Afganistan</option>
          <option value="PK">🇵🇰 Pakistan</option>
          <option value="BD">🇧🇩 Bangladeş</option>
          <option value="LK">🇱🇰 Sri Lanka</option>
          <option value="NP">🇳🇵 Nepal</option>
          <option value="BT">🇧🇹 Bhutan</option>
          <option value="MV">🇲🇻 Maldivler</option>
          <option value="MM">🇲🇲 Myanmar</option>
          <option value="LA">🇱🇦 Laos</option>
          <option value="KH">🇰🇭 Kamboçya</option>
          <option value="MN">🇲🇳 Moğolistan</option>
          <option value="KP">🇰🇵 Kuzey Kore</option>
          <option value="IL">🇮🇱 İsrail</option>
          <option value="LB">🇱🇧 Lübnan</option>
          <option value="SY">🇸🇾 Suriye</option>
          <option value="JO">🇯🇴 Ürdün</option>
          <option value="IQ">🇮🇶 Irak</option>
          <option value="IR">🇮🇷 İran</option>
          <option value="KW">🇰🇼 Kuveyt</option>
          <option value="SA">🇸🇦 Suudi Arabistan</option>
          <option value="AE">🇦🇪 Birleşik Arap Emirlikleri</option>
          <option value="QA">🇶🇦 Katar</option>
          <option value="BH">🇧🇭 Bahreyn</option>
          <option value="OM">🇴🇲 Umman</option>
          <option value="YE">🇾🇪 Yemen</option>
          <option value="EG">🇪🇬 Mısır</option>
          <option value="LY">🇱🇾 Libya</option>
          <option value="TN">🇹🇳 Tunus</option>
          <option value="DZ">🇩🇿 Cezayir</option>
          <option value="MA">🇲🇦 Fas</option>
          <option value="SD">🇸🇩 Sudan</option>
          <option value="SS">🇸🇸 Güney Sudan</option>
          <option value="ET">🇪🇹 Etiyopya</option>
          <option value="ER">🇪🇷 Eritre</option>
          <option value="DJ">🇩🇯 Cibuti</option>
          <option value="SO">🇸🇴 Somali</option>
          <option value="KE">🇰🇪 Kenya</option>
          <option value="UG">🇺🇬 Uganda</option>
          <option value="TZ">🇹🇿 Tanzanya</option>
          <option value="RW">🇷🇼 Ruanda</option>
          <option value="BI">🇧🇮 Burundi</option>
          <option value="MZ">🇲🇿 Mozambik</option>
          <option value="ZW">🇿🇼 Zimbabve</option>
          <option value="ZM">🇿🇲 Zambiya</option>
          <option value="MW">🇲🇼 Malavi</option>
          <option value="BW">🇧🇼 Botsvana</option>
          <option value="NA">🇳🇦 Namibya</option>
          <option value="ZA">🇿🇦 Güney Afrika</option>
          <option value="LS">🇱🇸 Lesotho</option>
          <option value="SZ">🇸🇿 Eswatini</option>
          <option value="MG">🇲🇬 Madagaskar</option>
          <option value="MU">🇲🇺 Mauritius</option>
          <option value="SC">🇸🇨 Seyşeller</option>
          <option value="KM">🇰🇲 Komorlar</option>
          <option value="TD">🇹🇩 Çad</option>
          <option value="CF">🇨🇫 Orta Afrika Cumhuriyeti</option>
          <option value="CM">🇨🇲 Kamerun</option>
          <option value="GQ">🇬🇶 Ekvator Ginesi</option>
          <option value="GA">🇬🇦 Gabon</option>
          <option value="CG">🇨🇬 Kongo Cumhuriyeti</option>
          <option value="CD">🇨🇩 Demokratik Kongo Cumhuriyeti</option>
          <option value="AO">🇦🇴 Angola</option>
          <option value="ST">🇸🇹 São Tomé ve Príncipe</option>
          <option value="GW">🇬🇼 Gine-Bissau</option>
          <option value="GN">🇬🇳 Gine</option>
          <option value="SL">🇸🇱 Sierra Leone</option>
          <option value="LR">🇱🇷 Liberya</option>
          <option value="CI">🇨🇮 Fildişi Sahili</option>
          <option value="GH">🇬🇭 Gana</option>
          <option value="TG">🇹🇬 Togo</option>
          <option value="BJ">🇧🇯 Benin</option>
          <option value="NG">🇳🇬 Nijerya</option>
          <option value="NE">🇳🇪 Nijer</option>
          <option value="BF">🇧🇫 Burkina Faso</option>
          <option value="ML">🇲🇱 Mali</option>
          <option value="SN">🇸🇳 Senegal</option>
          <option value="GM">🇬🇲 Gambiya</option>
          <option value="CV">🇨🇻 Yeşil Burun</option>
          <option value="MR">🇲🇷 Moritanya</option>
          <option value="EH">🇪🇭 Batı Sahra</option>
        </select>
      </div>
    </div>

    <!-- Recent Searches -->
    <div v-if="!searchQuery && recentSearches.length > 0" class="recent-searches-section">
      <div class="recent-searches-title">
        Recently searched
        <button @click="clearRecentSearches" class="clear-recent-btn">Clear all</button>
      </div>
      <div class="recent-searches-grid">
        <div 
          v-for="search in recentSearches.slice(0, 6)" 
          :key="search.id"
          @click="selectRecentSearch(search)"
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
        :key="result.id"
        @click="selectSearchResult(result)"
        class="search-result-dropdown-item"
      >
        <NuxtImg 
          :src="result.poster ? `https://image.tmdb.org/t/p/w200${result.poster}` : '/placeholder-movie.jpg'" 
          :alt="result.title"
          class="search-result-dropdown-poster"
          loading="lazy"
        />
        <div class="search-result-dropdown-info">
          <div class="search-result-dropdown-title">{{ result.title }}</div>
          <div class="search-result-dropdown-meta">{{ result.year }} • {{ result.type }}</div>
        </div>
        <div class="search-result-dropdown-type">{{ result.type }}</div>
      </div>
    </div>

    <!-- Selected Movie Providers -->
    <div v-if="selectedProviders.length > 0" class="providers-dropdown-section">
      <div class="providers-dropdown-title">Available on</div>
      <div class="providers-dropdown-grid">
        <div 
          v-for="provider in selectedProviders" 
          :key="provider.id"
          class="provider-dropdown-item"
        >
          <div class="provider-dropdown-logo" :style="{backgroundColor: provider.color}">
            {{ provider.name[0] }}
          </div>
          <span class="provider-dropdown-name">{{ provider.name }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="searchQuery && searchResults.length === 0" class="empty-dropdown-state">
      <div class="empty-dropdown-icon">🔍</div>
      <div class="empty-dropdown-text">No results found</div>
      <div class="empty-dropdown-subtext">Try searching for a different title</div>
    </div>
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
const recentSearches = computed(() => contentStore.recentSearches)

const selectedCountry = computed({
  get: () => searchStore.expandingSearchCountry,
  set: (value) => setSearchCountry(value)
})
</script> 