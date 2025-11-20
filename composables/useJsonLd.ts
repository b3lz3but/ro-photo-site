import { SITE_INFO, CONTACT } from '~/constants'

/**
 * JSON-LD structured data composable
 * Provides SEO-friendly structured data for search engines
 */
export const useJsonLd = () => {
  const personSchema = () => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: SITE_INFO.PHOTOGRAPHER,
            jobTitle: 'Professional Photographer',
            url: SITE_INFO.URL,
            image: `${SITE_INFO.URL}/img/green.webp`,
            sameAs: [
              CONTACT.INSTAGRAM,
            ],
            knowsAbout: ['Photography', 'Portrait Photography', 'Event Photography', 'Commercial Photography'],
            email: CONTACT.EMAIL,
            telephone: CONTACT.PHONE,
          }),
        },
      ],
    })
  }

  const portfolioSchema = () => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: SITE_INFO.NAME,
            description: SITE_INFO.TAGLINE,
            url: SITE_INFO.URL,
            image: `${SITE_INFO.URL}/img/green.webp`,
            priceRange: '$$',
            telephone: CONTACT.PHONE,
            email: CONTACT.EMAIL,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RO',
            },
          }),
        },
      ],
    })
  }

  const gallerySchema = (gallery: { title: string; description?: string; images?: Array<{ src: string; alt?: string }> }) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: gallery.title,
            description: gallery.description || gallery.title,
            image: gallery.images?.map(img => ({
              '@type': 'ImageObject',
              url: `${SITE_INFO.URL}${img.src}`,
              description: img.alt || gallery.title,
            })) || [],
          }),
        },
      ],
    })
  }

  const articleSchema = (article: { title: string; description?: string; date?: string; cover?: { src: string } }) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description || article.title,
            image: article.cover ? `${SITE_INFO.URL}${article.cover.src}` : undefined,
            datePublished: article.date,
            author: {
              '@type': 'Person',
              name: SITE_INFO.PHOTOGRAPHER,
            },
          }),
        },
      ],
    })
  }

  return {
    personSchema,
    portfolioSchema,
    gallerySchema,
    articleSchema,
  }
}
