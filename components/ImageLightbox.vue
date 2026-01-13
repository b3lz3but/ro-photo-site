<script setup lang="ts">
interface Image {
  src: string
  alt?: string
}

const props = defineProps<{
  images: Image[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex || 0)
const isZoomed = ref(false)

const currentImage = computed(() => props.images[currentIndex.value])

const hasNext = computed(() => currentIndex.value < props.images.length - 1)
const hasPrev = computed(() => currentIndex.value > 0)

const next = () => {
  if (hasNext.value) {
    currentIndex.value++
    isZoomed.value = false
  }
}

const prev = () => {
  if (hasPrev.value) {
    currentIndex.value--
    isZoomed.value = false
  }
}

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

const close = () => {
  emit('close')
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      next()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'Escape':
      close()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      @click.self="close"
    >
      <!-- Close button -->
      <button
        @click="close"
        class="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Închide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Counter -->
      <div class="absolute top-4 left-4 text-white/70 text-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Previous button -->
      <button
        v-if="hasPrev"
        @click="prev"
        class="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Imaginea anterioară"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Image -->
      <div
        class="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        :class="{ 'cursor-zoom-in': !isZoomed, 'cursor-zoom-out': isZoomed }"
        @click="toggleZoom"
      >
        <NuxtImg
          :src="currentImage.src"
          :alt="currentImage.alt || 'Gallery image'"
          class="max-w-full max-h-[90vh] object-contain transition-transform duration-300"
          :class="{ 'scale-150': isZoomed }"
          loading="eager"
        />
      </div>

      <!-- Next button -->
      <button
        v-if="hasNext"
        @click="next"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Imaginea următoare"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Thumbnails -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2"
      >
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="currentIndex = index; isZoomed = false"
          class="flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all"
          :class="index === currentIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'"
        >
          <NuxtImg
            :src="image.src"
            :alt="image.alt || `Thumbnail ${index + 1}`"
            class="w-full h-full object-cover"
            width="64"
            height="64"
          />
        </button>
      </div>
    </div>
  </Teleport>
</template>
