<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-6">Blog</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink v-for="post in posts" :key="post.slug" :to="`/blog/${post.slug}`" class="block group">
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/10 transition-colors">
            <h2 class="text-white text-xl font-semibold group-hover:text-white">{{ post.title }}</h2>
            <p class="text-white/60 text-sm mt-2">{{ post.excerpt }}</p>
            <p class="text-white/40 text-xs mt-3">{{ post.date }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'

const posts = [
  { slug: 'introducing-movai', title: 'movAi Tanıtımı: Duygu Bazlı Öneriler', date: '2025-09-01', excerpt: 'movAi ruh halinizi kullanarak film ve dizi önerilerini nasıl kişiselleştiriyor?' },
  { slug: 'how-our-recommendations-work', title: 'Önerilerimiz Nasıl Çalışır?', date: '2025-09-10', excerpt: 'Duygu ve geçmişi birleştiren hibrit yaklaşımımıza kısa bir bakış.' },
  { slug: 'product-updates-september', title: 'Ürün Güncellemeleri: Eylül', date: '2025-09-20', excerpt: 'UX iyileştirmeleri, performans düzenlemeleri ve yeni özellikler.' }
]

useHead({ 
  title: 'Blog',
  meta: [
    { name: 'description', content: 'movAi’den haberler, ürün güncellemeleri ve içerikler.' }
  ]
})
</script>

<style scoped>
</style>


