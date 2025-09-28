<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>movAi Tanıtımı: Duygu Bazlı Öneriler</h1>
      <p class="lead">movAi ruh halinize göre deneyiminizi nasıl kişiselleştiriyor?</p>
      <p>
        movAi, film ve dizi keşfine yeni bir yaklaşım getiriyor. Ruh halinizi paylaşın; duygu ipuçlarını
        izleme alışkanlıklarınızla harmanlayarak seveceğiniz içerikleri öne çıkaralım.
      </p>
      <h2>Neden duygular?</h2>
      <p>
        Duygular seçimlerimizi yönlendirir. Öneri sürecine ruh halinizi dahil ederek movAi, o anki
        hissinize daha uygun içerikler önerebilir.
      </p>
      <h2>Sırada ne var?</h2>
      <p>Geri bildirimlerinizle geliştirmeye devam edeceğiz. Keyifli keşifler!</p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'movAi Tanıtımı',
  meta: [
    { name: 'description', content: 'movAi ile ruh halinize göre film ve dizi keşfetmenin yeni yolu.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


