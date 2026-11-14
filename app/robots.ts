import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Rastreadores de buscadores con IA permitidos de forma explícita.
  const aiBots = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Bingbot']
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }, ...aiBots.map((userAgent) => ({ userAgent, allow: '/', disallow: '/admin/' }))],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
