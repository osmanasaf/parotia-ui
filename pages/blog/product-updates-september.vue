<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Ürün Güncellemeleri: Eylül</h1>
      <ul>
        <li>Yeni modern logo ve favicon</li>
        <li>Türkçe arayüz metin düzenlemeleri</li>
        <li>Performans ve API hata yönetimi iyileştirmeleri</li>
      </ul>
      <p>movAi’yi kullandığınız için teşekkürler! Gelecek ay daha fazlası geliyor.</p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'Ürün Güncellemeleri: Eylül',
  meta: [
    { name: 'description', content: 'Eylül sürümü öne çıkanlar: marka yenileme, metin iyileştirmeleri, performans düzenlemeleri.' }
  ]
})
</script>

<style scoped>
</style>


