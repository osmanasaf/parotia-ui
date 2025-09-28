export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const urls = [
    '/',
    '/movie',
    '/tv',
    '/watchlist',
    '/privacy-policy',
    '/terms-of-service',
    '/blog',
    '/blog/introducing-movai',
    '/blog/how-our-recommendations-work',
    '/blog/product-updates-september'
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((p) => `\n  <url><loc>${siteUrl}${p}</loc></url>`).join('') +
    `\n</urlset>`
  setHeader(event, 'Content-Type', 'application/xml')
  return body
})





