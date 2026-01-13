<script setup>
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://fixedfocused-designs.ro',
        name: 'Fixed Focused Designs',
        description: 'Servicii profesionale de fotografie în România. Portrete, evenimente, fotografie de produs și multe altele.',
        url: 'https://fixedfocused-designs.ro',
        image: 'https://fixedfocused-designs.ro/img/home/me.webp',
        logo: 'https://fixedfocused-designs.ro/img/home/me.webp',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RO',
          addressLocality: 'România'
        },
        founder: {
          '@type': 'Person',
          name: 'Ciprian Rădulescu',
          jobTitle: 'Fotograf Profesionist'
        },
        sameAs: [],
        openingHours: 'Mo-Fr 09:00-18:00',
        areaServed: {
          '@type': 'Country',
          name: 'România'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicii Fotografie',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fotografie de Portret'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fotografie de Eveniment'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fotografie de Produs'
              }
            }
          ]
        }
      })
    }
  ]
})
</script>

<template>
  <article class="min-h-screen flex flex-col items-stretch">
    <!-- Skip to content for accessibility -->
    <SkipToContent />

    <!-- Toast notifications -->
    <ToastNotification />

    <!-- Cookie consent banner -->
    <CookieConsent />

    <!-- WhatsApp floating button -->
    <WhatsAppButton />

    <!-- Scroll to top button -->
    <ScrollToTop />

    <!-- ring -->
    <div class="fixed inset-0 flex justify-center sm:px-8 pointer-events-none">
      <div class="flex w-full max-w-7xl lg:px-8">
        <div
          class="w-full bg-white ring-1 ring-zinc-200/50 dark:bg-zinc-900 dark:ring-zinc-500/20"
        />
      </div>
    </div>

    <!-- background -->
    <Container class="relative">
      <div class="absolute top-0 right-0">
        <NuxtImg
          src="img/bg-glow.png"
          aria-hidden="true"
          class="w-[44rem]"
          format="webp"
          width="944"
          height="586"
        />
      </div>
    </Container>

    <!-- header -->
    <Header />

    <!-- main -->
    <main id="main-content" class="maya-prose" role="main">
      <Container>
        <slot />
      </Container>
    </main>

    <!-- footer -->
    <Footer class="mt-auto" />

  </article>
</template>
