import { SITE_INFO, CONTACT, SOCIAL_LINKS, NAV_LINKS } from '~/constants'

/**
 * Site configuration composable
 * Provides centralized access to site-wide configuration
 */
export const useSiteConfig = () => {
  const config = {
    siteName: SITE_INFO.NAME,
    siteUrl: SITE_INFO.URL,
    tagline: SITE_INFO.TAGLINE,
    photographer: {
      name: SITE_INFO.PHOTOGRAPHER,
      email: CONTACT.EMAIL,
      phone: CONTACT.PHONE,
      instagram: CONTACT.INSTAGRAM,
      instagramHandle: CONTACT.INSTAGRAM_HANDLE,
    },
    social: SOCIAL_LINKS,
    navigation: NAV_LINKS,
  }

  return config
}
