<template>
  <div class="min-h-screen bg-[var(--bg-base)] text-white relative">
    <!-- Grain Overlay -->
    <div class="home-hero-grain" />
    <AppHeader />
    
    <main v-if="post" class="max-w-4xl mx-auto px-4 py-12">
      <NuxtLink to="/blog" class="inline-flex items-center text-amber-500 hover:text-amber-400 mb-8 transition-colors">
        <span class="mr-2">←</span> Bloga Dön
      </NuxtLink>

      <article>
        <header class="mb-12">
          <div class="flex items-center gap-3 mb-6 text-white/60 text-sm">
            <span>{{ post.date }}</span>
            <span>•</span>
            <span>{{ post.author }}</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            {{ post.title }}
          </h1>
          <div class="aspect-video rounded-3xl overflow-hidden border border-white/10">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
          </div>
        </header>

        <div class="prose prose-invert prose-amber max-w-none blog-content" v-html="post.content"></div>
      </article>
    </main>

    <div v-else class="min-h-[60vh] flex flex-col items-center justify-center">
      <h2 class="text-2xl font-bold mb-4">Blog yazısı bulunamadı</h2>
      <NuxtLink to="/blog" class="text-amber-500 hover:underline">Blog listesine dön</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { BLOG_POSTS } from '~/constants/blog'

const route = useRoute()
const slug = route.params.slug
const post = BLOG_POSTS.find(p => p.slug === slug)

const jsonLd = computed(() => {
  if (!post) return ''
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author,
      "url": "https://movai.app"
    }],
    "description": post.excerpt
  })
})

if (post) {
  useSeoMeta({
    title: post.title,
    ogTitle: post.title,
    description: post.excerpt,
    ogDescription: post.excerpt,
    ogImage: post.image,
    twitterCard: 'summary_large_image',
    articleAuthor: [post.author],
    articlePublishedTime: post.date,
  })

  useHead({
    link: [
      { rel: 'canonical', href: `https://movai.app/blog/${post.slug}` }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: jsonLd
      }
    ]
  })
}
</script>

<style>
@reference "tailwindcss";
.blog-content h2 {
  @apply text-3xl font-bold mt-12 mb-6 text-white;
}
.blog-content h3 {
  @apply text-2xl font-semibold mt-8 mb-4 text-amber-500;
}
.blog-content p {
  @apply text-lg text-white/80 leading-relaxed mb-6;
}
</style>
