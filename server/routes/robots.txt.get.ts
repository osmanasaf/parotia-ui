export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  setHeader(event, 'Content-Type', 'text/plain')
  return content
})



