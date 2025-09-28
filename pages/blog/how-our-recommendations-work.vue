<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Önerilerimiz Nasıl Çalışır?</h1>
      <p>İçerik önermek için iki ana sinyali birleştiriyoruz:</p>
      <ol>
        <li><strong>Duygu temelli giriş</strong>: mevcut ruh hâliniz ve niyetiniz</li>
        <li><strong>Geçmişe dayalı örüntüler</strong>: tercihlerinizi ve benzer kullanıcıları dikkate alma</li>
      </ol>
      <p>
        Bu hibrit yaklaşım, dengeli ve ilgili öneriler sunar. Geri bildirimlerle sıralama modelini
        sürekli iyileştiriyoruz.
      </p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'Önerilerimiz Nasıl Çalışır?',
  meta: [
    { name: 'description', content: 'movAi’nin hibrit sıralama yaklaşımına kısa bir genel bakış.' }
  ]
})
</script>

<style scoped>
</style>


