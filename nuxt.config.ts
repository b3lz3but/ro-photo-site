// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,

  /**
   * Nuxt.js modules
   */
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-icon",
  ],

  /**
   * Application configuration
   */
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          href: "https://fonts.googleapis.com/css2?Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,100;0,400;0,600;0,700;1,400&display=swap",
          rel: "stylesheet",
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  /**
   * Nuxt Image configuration
   */
  image: {
    formats: ['webp', 'avif', 'jpeg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  /**
   * Content configuration
   */
  content: {
    documentDriven: true,
    markdown: {
      anchorLinks: false,
    },
    highlight: {
      theme: 'github-dark',
    },
  },

  /**
   * Color mode configuration
   */
  colorMode: {
    classSuffix: "",
    preference: 'system',
    fallback: 'dark',
  },

  /**
   * Tailwind CSS configuration
   */
  tailwindcss: {
    cssPath: "./assets/css/tailwind.css",
  },

  /**
   * Nitro configuration (server-side)
   */
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/': { prerender: true },
      '/galleries': { swr: 3600 },
      '/stories': { swr: 3600 },
      '/hire-me': { prerender: true },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt'],
    },
  },

  /**
   * Security headers
   */
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
    },
  },

  /**
   * Runtime config
   */
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
    },
  },

  /**
   * TypeScript configuration
   */
  typescript: {
    strict: true,
    typeCheck: true,
  },

  /**
   * Development tools
   */
  devtools: {
    enabled: true,
  },

  compatibilityDate: "2025-02-05",
});
