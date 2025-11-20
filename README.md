# Fixed Focused Designs - Photography Portfolio

A modern, performant photography portfolio built with Nuxt 3, Vue 3, and Tailwind CSS.

## 🚀 Features

- **SEO Optimized**: JSON-LD structured data, Open Graph tags, sitemap.xml
- **Accessibility**: WCAG compliant with skip links, ARIA labels, keyboard navigation
- **Performance**: Image optimization, lazy loading, code splitting
- **Security**: CSP headers, input validation, rate limiting
- **Dark Mode**: System-aware dark mode support
- **Responsive**: Mobile-first design
- **Content Management**: Nuxt Content for galleries and stories
- **Search**: Full-text search across content
- **Contact Form**: Validated contact form with rate limiting
- **Toast Notifications**: User feedback system

## 📦 Tech Stack

- [Nuxt 3](https://nuxt.com/) - The Vue Framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Nuxt Content](https://content.nuxtjs.org/) - File-based CMS
- [Nuxt Image](https://image.nuxtjs.org/) - Image optimization
- [PhotoSwipe](https://photoswipe.com/) - Image gallery lightbox
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 🛠️ Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
├── components/        # Vue components
│   ├── content/      # Content-specific components
│   ├── ContactForm.vue
│   ├── SearchBar.vue
│   └── ...
├── composables/      # Reusable composition functions
│   ├── useSiteConfig.ts
│   ├── useSeo.ts
│   ├── useSearch.ts
│   └── ...
├── constants/        # Application constants
├── content/          # Markdown content (galleries, stories)
├── layouts/          # Layout components
├── pages/            # Route pages
├── plugins/          # Nuxt plugins
├── public/           # Static assets
├── server/           # Server-side code
│   ├── api/         # API endpoints
│   ├── routes/      # Server routes (sitemap)
│   └── utils/       # Server utilities
├── types/            # TypeScript type definitions
└── nuxt.config.ts   # Nuxt configuration
\`\`\`

## 🎨 Customization

### Site Configuration

Update the constants in \`/constants/index.ts\`:

\`\`\`typescript
export const SITE_INFO = {
  NAME: 'Your Site Name',
  TAGLINE: 'Your tagline',
  PHOTOGRAPHER: 'Your Name',
  URL: 'https://yourdomain.com',
}

export const CONTACT = {
  EMAIL: 'your@email.com',
  PHONE: '+1234567890',
  INSTAGRAM: 'https://instagram.com/yourusername',
}
\`\`\`

### Environment Variables

Create a \`.env\` file:

\`\`\`env
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

## 📝 Content Management

### Creating a Gallery

Create a new file in \`/content/galleries/\`:

\`\`\`markdown
---
title: "My Gallery"
description: "Gallery description"
cover:
  src: "/img/cover.jpg"
  alt: "Cover image"
category: "Portraits"
images:
  - src: "/img/photo1.jpg"
    alt: "Photo 1"
    width: 1200
    height: 800
  - src: "/img/photo2.jpg"
    alt: "Photo 2"
    width: 1200
    height: 800
---

Gallery content here...
\`\`\`

### Creating a Story

Create a new file in \`/content/stories/\`:

\`\`\`markdown
---
title: "My Story"
description: "Story description"
date: "2025-01-01"
cover:
  src: "/img/story-cover.jpg"
  alt: "Story cover"
---

Story content here...
\`\`\`

## 🔒 Security

- Content Security Policy (CSP) headers
- XSS protection
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure headers (X-Frame-Options, etc.)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Skip to content link
- Keyboard navigation support
- ARIA labels and roles
- Screen reader optimized
- Focus management
- Reduced motion support

## 🚢 Deployment

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview

\`\`\`bash
npm run preview
\`\`\`

### Deploy

Deploy to your preferred platform:
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, contact [ciprian.radulescu85@gmail.com](mailto:ciprian.radulescu85@gmail.com)
