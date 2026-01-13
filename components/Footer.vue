<template>
  <Container>
    <div class="text-zinc-600 dark:text-zinc-400 pb-16 mt-16">
      <div class="text-center space-y-4">
        <!-- Legal links -->
        <div class="flex justify-center gap-6 text-sm">
          <NuxtLink to="/privacy-policy" class="text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-400 dark:decoration-zinc-600">
            Politica de Confidențialitate
          </NuxtLink>
          <NuxtLink to="/terms" class="text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-400 dark:decoration-zinc-600">
            Termeni și Condiții
          </NuxtLink>
          <a href="/rss.xml" target="_blank" class="text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-400 dark:decoration-zinc-600">
            RSS Feed
          </a>
        </div>

        <!-- copyright -->
        <p class="text-sm">
          &copy; {{ new Date().getFullYear() }}
          <NuxtLink to="/" class="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">Fixed Focused Designs</NuxtLink>.
          Toate drepturile rezervate.
        </p>
      </div>
    </div>
  </Container>
</template>
