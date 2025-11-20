/**
 * Application-wide constants
 */

export const PARALLAX_SPEEDS = {
  SLOW: 3,
  MEDIUM: 1,
  NONE: 0,
  REVERSE: -1,
} as const

export const ANIMATION_DURATIONS = {
  FAST: 100,
  NORMAL: 300,
  SLOW: 500,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

export const GALLERY_CONFIG = {
  COLUMN_WIDTH: 300,
  GAP: 32,
  SSR_COLUMNS: 1,
  MAX_IMAGES_PER_PAGE: 50,
} as const

export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  GALLERY: { width: 600, height: 600 },
  HERO: { width: 1200, height: 800 },
  LIGHTBOX: { width: 1600, height: 1200 },
} as const

export const CONTACT = {
  EMAIL: 'ciprian.radulescu85@gmail.com',
  PHONE: '+40721354125',
  INSTAGRAM: 'https://www.instagram.com/b3lz3but/',
  INSTAGRAM_HANDLE: '@b3lz3but',
} as const

export const SITE_INFO = {
  NAME: 'Fixed Focused Designs',
  TAGLINE: 'Sculptăm Narațiuni Vizuale unde Emoțiile Se Întrepătrund cu Expresiile',
  PHOTOGRAPHER: 'Ciprian Rădulescu',
  URL: 'https://yourdomain.com', // Update with actual domain
} as const

export const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Galleries', to: '/galleries' },
  { name: 'Stories', to: '/stories' },
  { name: 'Hire me', to: '/hire-me' },
] as const

export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: CONTACT.INSTAGRAM,
    icon: 'fe:instagram',
    label: 'Follow on Instagram',
  },
  {
    name: 'Email',
    url: `mailto:${CONTACT.EMAIL}`,
    icon: 'heroicons:envelope-20-solid',
    label: 'Send an email',
  },
  {
    name: 'Phone',
    url: `tel:${CONTACT.PHONE}`,
    icon: 'fe:phone',
    label: 'Call us',
  },
] as const
