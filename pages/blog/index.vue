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
  { slug: 'introducing-movai', title: 'Introducing movAi: Emotion-based Recommendations', date: '2025-09-01', excerpt: 'How movAi personalizes your movie and TV suggestions using your mood.' },
  { slug: 'how-our-recommendations-work', title: 'How Our Recommendations Work', date: '2025-09-10', excerpt: 'A peek into our hybrid recommendation approach combining emotion and history.' },
  { slug: 'product-updates-september', title: 'Product Updates: September', date: '2025-09-20', excerpt: 'A summary of UX improvements, performance tweaks, and new features.' }
]

useHead({ 
  title: 'Blog',
  meta: [
    { name: 'description', content: 'News, product updates and insights from movAi.' }
  ]
})
</script>

<style scoped>
</style>


