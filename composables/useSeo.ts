import { SITE_INFO } from '~/constants'

/**
 * SEO meta tags composable
 * Provides consistent SEO configuration across pages
 */
export const useSeo = (options: {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  url?: string
}) => {
  const route = useRoute()
  const fullTitle = options.title
    ? `${options.title} | ${SITE_INFO.NAME}`
    : SITE_INFO.NAME

  const canonicalUrl = options.url || `${SITE_INFO.URL}${route.path}`
  const ogImage = options.image || `${SITE_INFO.URL}/img/green.webp`

  useSeoMeta({
    title: fullTitle,
    description: options.description || SITE_INFO.TAGLINE,
    ogTitle: fullTitle,
    ogDescription: options.description || SITE_INFO.TAGLINE,
    ogImage,
    ogUrl: canonicalUrl,
    ogType: options.type || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: options.description || SITE_INFO.TAGLINE,
    twitterImage: ogImage,
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  })
}
