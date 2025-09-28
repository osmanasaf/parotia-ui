<template>
  <div class="min-h-screen gradient-dark relative">
    <div 
      v-if="tvDetail?.backdrop_path" 
      class="absolute inset-0 z-0"
    >
      <img 
        :src="`https://image.tmdb.org/t/p/w1280${tvDetail.backdrop_path}`"
        :alt="tvDetail.name"
        class="w-full h-full object-cover opacity-30"
      >
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80"></div>
    </div>
    <nav class="glass-effect sticky top-0 z-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-3xl font-bold font-space text-gradient">
                  🎬 movAi
                </h1>
              </div>
            </NuxtLink>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">← Geri</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p class="text-white/80">Dizi detayları yükleniyor...</p>
      </div>
    </div>

    <div v-else-if="tvDetail" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div class="lg:col-span-1">
          <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
            <img 
              v-if="tvDetail.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${tvDetail.poster_path}`"
              :alt="tvDetail.name"
              class="w-full h-full object-cover rounded-2xl"
            >
            <div v-else class="text-white/60 text-center p-8">
              <div class="text-6xl mb-4">📺</div>
              <div class="text-lg font-medium">{{ tvDetail.name }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ tvDetail.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-white/80 mb-6">
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="ml-1 font-semibold">{{ tvDetail.vote_average?.toFixed(1) || '—' }}</span>
              </div>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.first_air_date || '2024' }}</span>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.number_of_seasons || '1' }} Sezon</span>
              <span class="text-white/60">•</span>
              <span>{{ tvDetail.number_of_episodes || '10' }} Bölüm</span>
            </div>
          </div>

          <div v-if="tvDetail.genres?.length">
            <h3 class="text-lg font-semibold text-white mb-3">Türler</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in tvDetail.genres" 
                :key="genre.id"
                class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm"
              >
                {{ genre.name }}
              </span>
            </div>
          </div>

          <div v-if="tvDetail.overview">
            <h3 class="text-lg font-semibold text-white mb-3">Özet</h3>
            <p class="text-white/80 leading-relaxed">
              {{ tvDetail.overview }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="tvDetail.cast?.length">
              <h3 class="text-lg font-semibold text-white mb-3">Oyuncular</h3>
              <div class="space-y-1">
                <p 
                  v-for="actor in tvDetail.cast.slice(0, 5)" 
                  :key="actor"
                  class="text-white/70 text-sm"
                >
                  {{ actor }}
                </p>
              </div>
            </div>
            
            <div v-if="tvDetail.seasons?.length">
              <h3 class="text-lg font-semibold text-white mb-3">Sezonlar</h3>
              <div class="space-y-2">
                <div 
                  v-for="season in tvDetail.seasons.slice(0, 3)" 
                  :key="season.id"
                  class="bg-white/5 rounded-lg p-3"
                >
                  <p class="text-white font-medium">{{ season.name }}</p>
                  <p class="text-white/60 text-sm">{{ season.episode_count }} bölüm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            📺 Nerede İzlenir?
          </h2>
          <div class="flex items-center">
            <label for="country-select" class="text-white/80 mr-3">Ülke:</label>
            <select 
              id="country-select"
              v-model="selectedCountry" 
              @change="loadWatchProviders"
              class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div v-if="isLoadingProviders" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p class="text-white/70">Platform bilgileri yükleniyor...</p>
        </div>

        <div v-else-if="watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="provider in watchProviders" 
            :key="provider.provider_id"
            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
              <NuxtImg 
                v-if="provider.logo_path"
                :src="`https://image.tmdb.org/t/p/original${provider.logo_path}`"
                :alt="provider.provider_name"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ provider.provider_name[0] }}</span>
              </div>
            </div>
            <h3 class="text-white font-semibold text-sm">{{ provider.provider_name }}</h3>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-6xl mb-4">😔</div>
          <h3 class="text-xl font-semibold text-white mb-2">Platform Bilgisi Bulunamadı</h3>
          <p class="text-white/70">Bu içerik için henüz platform bilgisi mevcut değil.</p>
        </div>
      </div>

      <div class="mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">
            🎭 Benzer Diziler
          </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="similar in similarShows" 
            :key="similar.id"
            @click="goToTV(similar.id)"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
              <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="similar.poster"
                  :src="`https://image.tmdb.org/t/p/w342${similar.poster}`"
                  :alt="similar.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display = 'none'"
                >
                <div v-else class="text-white/60 text-center p-4">
                  <div class="text-3xl mb-2">📺</div>
                  <div class="text-sm font-medium">{{ similar.name }}</div>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 class="text-white text-sm font-semibold truncate">{{ similar.name }}</h3>
                <div class="flex items-center mt-1">
                  <span class="text-yellow-400 text-xs">⭐</span>
                  <span class="text-white/80 text-xs ml-1">{{ similar.rating?.toFixed(1) || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="text-6xl mb-4">😞</div>
        <h2 class="text-2xl font-bold text-white mb-2">Dizi Bulunamadı</h2>
        <p class="text-white/70 mb-6">Aradığınız dizi mevcut değil veya bir hata oluştu.</p>
        <NuxtLink 
          to="/" 
          class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          Ana Sayfaya Dön
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tvId = route.params.id

const tvDetail = ref(null)
const watchProviders = ref([])
const similarShows = ref([])
const isLoading = ref(true)
const isLoadingProviders = ref(false)
const selectedCountry = ref('TR')
const mockSimilarShows = [
  { id: 201, name: 'Similar Show 1', rating: 7.8 },
  { id: 202, name: 'Similar Show 2', rating: 8.1 },
  { id: 203, name: 'Similar Show 3', rating: 7.3 },
  { id: 204, name: 'Similar Show 4', rating: 6.9 },
  { id: 205, name: 'Similar Show 5', rating: 7.6 },
  { id: 206, name: 'Similar Show 6', rating: 8.0 },
]

const loadTVDetail = async () => {
  isLoading.value = true
  
  try {
    const { getTVDetailsWithSimilar, getTVDetailsWithSimilarPublic } = useApi()
    const { isLoggedIn } = useAuth()
    const response = isLoggedIn.value
      ? await getTVDetailsWithSimilar(tvId)
      : await getTVDetailsWithSimilarPublic(tvId)
    
    if (response.success && response.data) {
      const data = response.data.detail || response.data
      tvDetail.value = {
        id: data.id,
        name: data.name,
        overview: data.overview,
        vote_average: data.vote_average,
        first_air_date: data.first_air_date,
        last_air_date: data.last_air_date,
        number_of_seasons: data.number_of_seasons,
        number_of_episodes: data.number_of_episodes,
        genres: data.genres || [],
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        cast: data.cast || [],
        crew: data.crew || [],
        seasons: data.seasons || []
      }
    }
    if (response.success && response.data?.similar) {
      similarShows.value = response.data.similar.map(s => ({
        id: s.tmdb_id,
        name: s.title || s.name,
        rating: s.vote_average,
        poster: s.poster_path,
      }))
    } else {
      similarShows.value = mockSimilarShows
    }
    
    await loadWatchProviders()
    
  } catch (error) {
    console.error('TV show details loading error:', error)
    // Use mock data if API fails
    tvDetail.value = {
      id: tvId,
      name: `Amazing TV Show ${tvId}`,
      overview: 'This incredible TV show captivates viewers with its compelling storyline. Perfect acting, impressive visual effects, and strong writing provide a complete television experience.',
      vote_average: 8.5,
      first_air_date: '2024-01-15',
      last_air_date: '2024-12-15',
      number_of_seasons: 3,
      number_of_episodes: 30,
      genres: [
        {id: 18, name: "Drama"},
        {id: 10765, name: "Sci-Fi & Fantasy"}
      ],
      poster_path: null,
      backdrop_path: null,
      cast: ['Lead Actor 1', 'Lead Actor 2', 'Famous Actor 3'],
      seasons: [
        {id: 1, name: 'Season 1', episode_count: 10},
        {id: 2, name: 'Season 2', episode_count: 12},
        {id: 3, name: 'Season 3', episode_count: 8}
      ]
    }
    similarShows.value = mockSimilarShows
    await loadWatchProviders()
  } finally {
    isLoading.value = false
  }
}

const loadWatchProviders = async () => {
  isLoadingProviders.value = true
  
  try {
    const { getWatchProviders } = useApi()
    const response = await getWatchProviders(tvId, selectedCountry.value)
    
    console.log('Watch providers response:', response)
    
    if (response.success && response.data?.results) {
      const countryData = response.data.results[selectedCountry.value]
      console.log('Country data for', selectedCountry.value, ':', countryData)
      
      if (countryData) {
        // Tüm provider türlerini birleştir (flatrate, buy, rent)
        const allProviders = []
        
        if (countryData.flatrate && Array.isArray(countryData.flatrate)) {
          allProviders.push(...countryData.flatrate.map(provider => ({
            ...provider,
            type: 'flatrate'
          })))
        }
        
        if (countryData.buy && Array.isArray(countryData.buy)) {
          allProviders.push(...countryData.buy.map(provider => ({
            ...provider,
            type: 'buy'
          })))
        }
        
        if (countryData.rent && Array.isArray(countryData.rent)) {
          allProviders.push(...countryData.rent.map(provider => ({
            ...provider,
            type: 'rent'
          })))
        }
        
        // Duplicate provider'ları kaldır (aynı provider_id'ye sahip olanları)
        const uniqueProviders = allProviders.filter((provider, index, self) => 
          index === self.findIndex(p => p.provider_id === provider.provider_id)
        )
        
        console.log('All providers:', allProviders)
        console.log('Unique providers:', uniqueProviders)
        
        watchProviders.value = uniqueProviders
      } else {
        watchProviders.value = []
      }
    } else {
      watchProviders.value = []
    }
    
  } catch (error) {
    console.error('Platform information loading error:', error)
    watchProviders.value = []
  } finally {
    isLoadingProviders.value = false
  }
}

const goToTV = (newTVId) => {
  navigateTo(`/tv/${newTVId}`)
}

const addToWatchlist = async () => {
  try {
    const { addToWatchlist: addToWatchlistApi } = useApi()
    await addToWatchlistApi(tvId, 'tv', 'to_watch')
    console.log('TV show added to watchlist!')
  } catch (error) {
    console.error('Add to watchlist error:', error)
  }
}

const rateTV = async (rating) => {
  try {
    const { rateMovie: rateTVApi } = useApi()
    await rateTVApi(tvId, rating)
    console.log(`TV show rated ${rating} stars!`)
  } catch (error) {
    console.error('Rating error:', error)
  }
}

watch(
  () => route.params.id,
  () => {
    loadTVDetail()
  },
  { immediate: true }
)

useHead({
  title: computed(() => tvDetail.value ? `${tvDetail.value.name} - movAi` : 'Dizi Detayları - movAi'),
  meta: [
    { name: 'description', content: computed(() => tvDetail.value?.overview || 'Dizi detay sayfası') }
  ]
})
</script>