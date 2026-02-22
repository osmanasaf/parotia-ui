<template>
  <div class="min-h-screen bg-[var(--bg-base)] text-white relative">
    <!-- Grain Overlay -->
    <div class="home-hero-grain" />
    <AppHeader />
    
    <header class="py-20 px-4 text-center relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="home-hero-ambient" />
      
      <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Sinema & <span class="text-amber-500">Duygular</span>
      </h1>
      <p class="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
        Yapay zeka analizleri, özel film listeleri ve sinema dünyasından en yeni haberler.
      </p>
    </header>

    <main class="max-w-7xl mx-auto px-4 pb-24">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink 
          v-for="post in BLOG_POSTS" 
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group block bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)]"
        >
          <div class="aspect-video overflow-hidden">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
          </div>
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4 text-white/40 text-sm">
              <span>{{ post.date }}</span>
              <span>•</span>
              <span>{{ post.author }}</span>
            </div>
            <h2 class="text-2xl font-bold mb-4 leading-tight group-hover:text-amber-500 transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-white/60 line-clamp-2 leading-relaxed mb-6">
              {{ post.excerpt }}
            </p>
            <div class="flex items-center text-amber-500 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              Devamını Oku <span class="ml-2">→</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { BLOG_POSTS } from '~/constants/blog'

useSeoMeta({
  title: 'Blog',
  description: 'Sinema dünyasından en iyi listeler, yapay zeka analizleri ve film önerileri movAi blog sayfasında.',
  ogTitle: 'Blog - movAi',
  ogDescription: 'Sinema dünyasından en iyi listeler ve film önerileri.',
  ogImage: 'https://images.unsplash.com/photo-1485090916723-95c55531599a?auto=format&fit=crop&q=80&w=1280'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://movai.app/blog' }
  ]
})
</script>
