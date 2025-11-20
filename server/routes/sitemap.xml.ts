import { serverQueryContent } from '#content/server'
import { SITE_INFO } from '~/constants'

export default defineEventHandler(async (event) => {
  const baseUrl = SITE_INFO.URL

  // Fetch all galleries
  const galleries = await serverQueryContent(event, 'galleries')
    .where({ _extension: 'md' })
    .find()

  // Fetch all stories
  const stories = await serverQueryContent(event, 'stories')
    .where({ _extension: 'md' })
    .find()

  // Static pages
  const staticPages = [
    { loc: `${baseUrl}/`, priority: 1.0 },
    { loc: `${baseUrl}/galleries`, priority: 0.9 },
    { loc: `${baseUrl}/stories`, priority: 0.8 },
    { loc: `${baseUrl}/hire-me`, priority: 0.8 },
  ]

  // Dynamic gallery pages
  const galleryPages = galleries.map(gallery => ({
    loc: `${baseUrl}${gallery._path}`,
    priority: 0.7,
    lastmod: gallery.date || new Date().toISOString().split('T')[0],
  }))

  // Dynamic story pages
  const storyPages = stories.map(story => ({
    loc: `${baseUrl}${story._path}`,
    priority: 0.6,
    lastmod: story.date || new Date().toISOString().split('T')[0],
  }))

  const allPages = [...staticPages, ...galleryPages, ...storyPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
    .map(
      page => `  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`
    )
    .join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
