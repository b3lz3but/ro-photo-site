import { serverQueryContent } from '#content/server'
import { SITE_INFO, CONTACT } from '~/constants'

export default defineEventHandler(async (event) => {
  const baseUrl = SITE_INFO.URL

  // Fetch all stories
  const stories = await serverQueryContent(event, 'stories')
    .where({ _extension: 'md' })
    .sort({ date: -1 })
    .find()

  const rssItems = stories.map(story => {
    const link = `${baseUrl}${story._path}`
    const pubDate = story.date ? new Date(story.date).toUTCString() : new Date().toUTCString()

    return `    <item>
      <title><![CDATA[${story.title || 'Untitled'}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${story.description || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_INFO.NAME} - Povești</title>
    <link>${baseUrl}/stories</link>
    <description>Povești și proiecte foto de la ${SITE_INFO.PHOTOGRAPHER}</description>
    <language>ro</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/img/home/me.webp</url>
      <title>${SITE_INFO.NAME}</title>
      <link>${baseUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return rss
})
