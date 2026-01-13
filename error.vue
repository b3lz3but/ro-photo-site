<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-4">
    <div class="text-center max-w-xl">
      <!-- Error Code -->
      <h1 class="font-display text-9xl font-bold text-gradient mb-4">
        {{ error?.statusCode || '404' }}
      </h1>

      <!-- Error Message -->
      <h2 class="font-display text-3xl text-zinc-800 dark:text-zinc-200 mb-4">
        {{ error?.statusCode === 404 ? 'Pagina nu a fost găsită' : 'A apărut o eroare' }}
      </h2>

      <p class="text-zinc-600 dark:text-zinc-400 mb-8">
        {{ error?.statusCode === 404
          ? 'Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.'
          : error?.message || 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.'
        }}
      </p>

      <!-- Back Home Button -->
      <button
        @click="handleError"
        class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Înapoi la pagina principală
      </button>

      <!-- Quick Links -->
      <div class="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Poate te interesează:</p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/galleries" class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Galerii
          </NuxtLink>
          <NuxtLink to="/stories" class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Povești
          </NuxtLink>
          <NuxtLink to="/hire-me" class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Contact
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
