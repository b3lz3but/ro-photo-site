<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
})

const handleError = () => clearError({ redirect: '/' })

const errorMessages = {
  404: {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for doesn\'t exist or has been moved.',
  },
  500: {
    title: 'Server Error',
    message: 'Oops! Something went wrong on our end. Please try again later.',
  },
  default: {
    title: 'An Error Occurred',
    message: 'Something unexpected happened. We\'re working to fix it.',
  },
}

const currentError = computed(() => {
  const statusCode = props.error.statusCode
  if (statusCode === 404) return errorMessages[404]
  if (statusCode >= 500) return errorMessages[500]
  return errorMessages.default
})

useSeoMeta({
  title: `${currentError.value.title} | Fixed Focused Designs`,
  description: currentError.value.message,
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-900">
    <div class="max-w-2xl w-full text-center">
      <!-- Error code -->
      <h1 class="text-9xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        {{ error.statusCode || '500' }}
      </h1>

      <!-- Error title -->
      <h2 class="text-3xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
        {{ currentError.title }}
      </h2>

      <!-- Error message -->
      <p class="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
        {{ currentError.message }}
      </p>

      <!-- Error details (only in development) -->
      <div v-if="error.message && process.dev" class="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
        <p class="text-sm font-mono text-red-800 dark:text-red-200">
          {{ error.message }}
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleError"
          class="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Go to Homepage
        </button>
        <button
          @click="$router.back()"
          class="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          Go Back
        </button>
      </div>

      <!-- Support message -->
      <p class="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
        If this problem persists, please
        <a href="mailto:ciprian.radulescu85@gmail.com" class="underline hover:text-zinc-700 dark:hover:text-zinc-300">
          contact support
        </a>
      </p>
    </div>
  </div>
</template>
