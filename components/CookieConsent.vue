<script setup lang="ts">
const isVisible = ref(false)
const COOKIE_KEY = 'cookie-consent'

const acceptCookies = () => {
  localStorage.setItem(COOKIE_KEY, 'accepted')
  isVisible.value = false
}

const declineCookies = () => {
  localStorage.setItem(COOKIE_KEY, 'declined')
  isVisible.value = false
}

onMounted(() => {
  const consent = localStorage.getItem(COOKIE_KEY)
  if (!consent) {
    // Show banner after a short delay
    setTimeout(() => {
      isVisible.value = true
    }, 1000)
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 shadow-lg p-4 md:p-6"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-sm text-zinc-600 dark:text-zinc-300 text-center md:text-left">
          <p>
            Folosim cookie-uri esențiale pentru funcționarea site-ului.
            <NuxtLink to="/privacy-policy" class="underline hover:text-zinc-900 dark:hover:text-white">
              Află mai multe
            </NuxtLink>
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="declineCookies"
            class="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Refuz
          </button>
          <button
            @click="acceptCookies"
            class="px-6 py-2 text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
