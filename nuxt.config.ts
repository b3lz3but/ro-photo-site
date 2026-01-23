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
        lang: 'ro',
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "apple-touch-icon", href: "/favicon.ico" },
        // Preconnect to external resources
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
        { rel: "preconnect", href: "https://cloud.umami.is" },
        // DNS prefetch for faster resolution
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
        // Preload critical font with font-display: swap
        {
          rel: "preload",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Poppins:wght@400;600&display=swap",
          as: "style",
          onload: "this.onload=null;this.rel='stylesheet'"
        },
        { rel: "alternate", type: "application/rss+xml", title: "Fixed Focused Designs - Povești", href: "/rss.xml" },
        // Preload LCP image for mobile
        { rel: "preload", href: "/_ipx/w_400&f_webp&q_80/img/home/green.webp", as: "image", type: "image/webp", media: "(max-width: 639px)", fetchpriority: "high" },
        // Preload LCP image for tablet/desktop
        { rel: "preload", href: "/_ipx/w_384&f_webp&q_80/img/home/green.webp", as: "image", type: "image/webp", media: "(min-width: 640px)", fetchpriority: "high" },
      ],
      // Fallback for non-JS font loading
      noscript: [
        { innerHTML: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Poppins:wght@400;600&display=swap">' }
      ],
      script: [
        // Defer analytics script
        {
          src: "https://cloud.umami.is/script.js",
          defer: true,
          async: true,
          "data-website-id": "2ad2a9a4-85a0-4508-a861-452edf506c74"
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'Fixed Focused Designs - Servicii profesionale de fotografie în România. Portrete, evenimente, fotografie de produs.' },
        { name: 'author', content: 'Ciprian Rădulescu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Fixed Focused Designs' },
        { property: 'og:title', content: 'Fixed Focused Designs - Fotografie Profesională' },
        { property: 'og:description', content: 'Servicii profesionale de fotografie în România.' },
        { property: 'og:image', content: 'https://fixedfocused-designs.ro/img/home/me.webp' },
        { property: 'og:url', content: 'https://fixedfocused-designs.ro' },
        { property: 'og:locale', content: 'ro_RO' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Fixed Focused Designs - Fotografie Profesională' },
        { name: 'twitter:description', content: 'Servicii profesionale de fotografie în România.' },
        { name: 'twitter:image', content: 'https://fixedfocused-designs.ro/img/home/me.webp' },
        // Performance hints
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  /**
   * Nuxt Image configuration - optimized for performance
   */
  image: {
    formats: ['avif', 'webp'],
    quality: 75,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      thumbnail: {
        modifiers: {
          format: 'webp',
          quality: 70,
          width: 200,
          height: 200,
        }
      },
      hero: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 800,
        }
      }
    },
    densities: [1, 2],
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
   * Vite configuration for build optimization
   */
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
          }
        }
      }
    },
    css: {
      devSourcemap: false,
    }
  },

  /**
   * Experimental features for performance
   */
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    componentIslands: true,
    viewTransition: true,
  },

  /**
   * Nitro configuration (server-side)
   */
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true,
    routeRules: {
      '/': { prerender: true },
      '/galleries': { swr: 3600 },
      '/stories': { swr: 3600 },
      '/hire-me': { prerender: true },
      '/privacy-policy': { prerender: true },
      '/terms': { prerender: true },
      // Cache static assets
      '/img/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml', '/robots.txt', '/rss.xml'],
      failOnError: false,
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://fixedfocused-designs.ro',
    },
  },

  /**
   * TypeScript configuration
   */
  typescript: {
    strict: false,
    typeCheck: false,
  },

  /**
   * Development tools
   */
  devtools: {
    enabled: false,
  },

  compatibilityDate: "2025-02-05",
});
