<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
    <div 
      v-if="movieDetail?.backdrop_path" 
      class="absolute inset-0 z-0"
    >
      <img 
        :src="`https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`"
        :alt="movieDetail.title"
        class="w-full h-full object-cover opacity-30"
      >
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80"></div>
    </div>
    <nav class="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-2xl font-bold text-white">
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
        <CinemaSpinner size="lg" label="Film detayları yükleniyor..." />
      </div>
    </div>

    <div v-else-if="movieDetail" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div class="lg:col-span-1">
          <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
            <img 
              v-if="movieDetail.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`"
              :alt="movieDetail.title"
              class="w-full h-full object-cover rounded-2xl"
            >
            <div v-else class="text-white/60 text-center p-8">
              <div class="text-6xl mb-4">🎬</div>
              <div class="text-lg font-medium">{{ movieDetail.title }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ movieDetail.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-white/80 mb-6">
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="ml-1 font-semibold">{{ movieDetail.vote_average?.toFixed(1) || '—' }}</span>
              </div>
              <span class="text-white/60">•</span>
              <span>{{ movieDetail.release_date || '2024' }}</span>
              <span class="text-white/60">•</span>
              <span>{{ movieDetail.runtime || '120' }} dk</span>
            </div>
          </div>

          <div v-if="movieDetail.genre_names?.length">
            <h3 class="text-lg font-semibold text-white mb-3">Türler</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in movieDetail.genre_names" 
                :key="genre"
                class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <div v-if="movieDetail.overview">
            <h3 class="text-lg font-semibold text-white mb-3">Konusu</h3>
            <p class="text-white/80 leading-relaxed">
              {{ movieDetail.overview }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="movieDetail.director">
              <h3 class="text-lg font-semibold text-white mb-3">Yönetmen</h3>
              <p class="text-white/80">{{ movieDetail.director }}</p>
            </div>
            <div v-if="movieDetail.cast?.length">
              <h3 class="text-lg font-semibold text-white mb-3">Oyuncular</h3>
              <p class="text-white/80">{{ movieDetail.cast.slice(0, 3).join(', ') }}</p>
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
              <option value="MA">🇲🇦 Fas</option>
              <option value="DZ">🇩🇿 Cezayir</option>
              <option value="TN">🇹🇳 Tunus</option>
              <option value="LY">🇱🇾 Libya</option>
              <option value="EG">🇪🇬 Mısır</option>
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

        <div v-else-if="watchProviders && watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          🎭 Benzer Filmler
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="similar in similarMovies" 
            :key="similar.id"
            @click="goToMovie(similar.id)"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
              <div class="aspect-[2/3] bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="similar.poster"
                  :src="`https://image.tmdb.org/t/p/w342${similar.poster}`"
                  :alt="similar.title"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display = 'none'"
                >
                <div v-else class="text-white/60 text-center p-4">
                  <div class="text-3xl mb-2">🎬</div>
                  <div class="text-sm font-medium">{{ similar.title }}</div>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 class="text-white text-sm font-semibold truncate">{{ similar.title }}</h3>
                <div class="flex items-center mt-1">
                  <span class="text-yellow-400 text-xs">⭐</span>
                  <span class="text-white/80 text-xs ml-1">{{ similar.rating?.toFixed(1) || 'N/A' }}</span>
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
        <h2 class="text-2xl font-bold text-white mb-2">Film Bulunamadı</h2>
        <p class="text-white/70 mb-6">Aradığınız film mevcut değil veya bir hata oluştu.</p>
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
import CinemaSpinner from '~/components/ui/CinemaSpinner.vue'

const route = useRoute()
const movieId = route.params.id

const movieDetail = ref(null)
const watchProviders = ref([])
const similarMovies = ref([])
const isLoading = ref(true)
const isLoadingProviders = ref(false)
const selectedCountry = ref('TR')
const mockSimilarMovies = [
  { id: 201, title: 'Benzer Film 1', rating: 7.8 },
  { id: 202, title: 'Benzer Film 2', rating: 8.1 },
  { id: 203, title: 'Benzer Film 3', rating: 7.3 },
  { id: 204, title: 'Benzer Film 4', rating: 6.9 },
  { id: 205, title: 'Benzer Film 5', rating: 7.6 },
  { id: 206, title: 'Benzer Film 6', rating: 8.0 },
]

const loadMovieDetail = async () => {
  isLoading.value = true
  
  try {
    const { getMovieDetailsWithSimilar, getMovieDetailsWithSimilarPublic } = useApi()
    const { isLoggedIn } = useAuth()
    const response = isLoggedIn.value
      ? await getMovieDetailsWithSimilar(movieId)
      : await getMovieDetailsWithSimilarPublic(movieId)
    
    if (response.success && response.data) {
      const data = response.data.detail || response.data
      movieDetail.value = {
        tmdb_id: data.id,
        title: data.title,
        overview: data.overview,
        vote_average: data.vote_average,
        release_date: data.release_date,
        runtime: data.runtime,
        genres: data.genres || [],
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        cast: data.cast || [],
        crew: data.crew || [],
        production_companies: data.production_companies || []
      }
    }
    // similar
    if (response.success && response.data?.similar) {
      similarMovies.value = response.data.similar.map(s => ({
        id: s.tmdb_id,
        title: s.title || s.name,
        rating: s.vote_average,
        poster: s.poster_path,
      }))
    } else {
      similarMovies.value = mockSimilarMovies
    }
    
    await loadWatchProviders()
    
  } catch (error) {
    console.error('Film detayı yüklenirken hata:', error)
    const { getMockMovieDetail } = useApi()
    const mockData = getMockMovieDetail(movieId)
    movieDetail.value = {
      tmdb_id: mockData.tmdb_id,
      title: mockData.title,
      overview: mockData.overview,
      vote_average: mockData.vote_average,
      release_date: mockData.release_date,
      runtime: mockData.runtime,
      genre_names: mockData.genre_names,
      director: mockData.director,
      cast: mockData.cast
    }
    similarMovies.value = mockSimilarMovies
    await loadWatchProviders()
  } finally {
    isLoading.value = false
  }
}

const loadWatchProviders = async () => {
  isLoadingProviders.value = true
  
  try {
    const { getWatchProviders } = useApi()
    const response = await getWatchProviders(movieId, selectedCountry.value)
    
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
    console.error('Platform bilgileri yüklenirken hata:', error)
    watchProviders.value = []
  } finally {
    isLoadingProviders.value = false
  }
}

const goToMovie = (newMovieId) => {
  navigateTo(`/movie/${newMovieId}`)
}

const addToWatchlist = async () => {
  try {
    const { addToWatchlist: addToWatchlistApi } = useApi()
    await addToWatchlistApi(movieId, 'movie', 'to_watch')
    console.log('Film izleme listesine eklendi!')
  } catch (error) {
    console.error('Izleme listesine ekleme hatası:', error)
  }
}

const rateMovie = async (rating) => {
  try {
    const { rateMovie: rateMovieApi } = useApi()
    await rateMovieApi(movieId, rating)
    console.log(`Film ${rating} puanla puanlandı!`)
  } catch (error) {
    console.error('Puanlama hatası:', error)
  }
}
// Tek kaynaklı tetikleme: id değiştiğinde detayları yükle
watch(
  () => route.params.id,
  () => {
    loadMovieDetail()
  },
  { immediate: true }
)
useHead({
  title: computed(() => movieDetail.value ? `${movieDetail.value.title} - movAi` : 'Film Detayları - movAi'),
  meta: [
    { name: 'description', content: computed(() => movieDetail.value?.overview || 'Film detay sayfası') }
  ]
})
</script>