export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl?.replace(/\/$/, '') || ''
  const canonical = `${siteUrl}${route.path}`

  useHead({
    link: [
      { rel: 'canonical', href: canonical }
    ],
    meta: [
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: '/og-image.svg' }
    ]
  })
})



