<script setup lang="ts">
interface Props {
  images: Array<{ src: string; alt?: string }>;
  initialIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
});

const emit = defineEmits<{
  close: [];
}>();

const currentIndex = ref(props.initialIndex);
const isZoomed = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);

const currentImage = computed(() => props.images[currentIndex.value]);
const hasNext = computed(() => currentIndex.value < props.images.length - 1);
const hasPrev = computed(() => currentIndex.value > 0);

const next = () => {
  if (hasNext.value) {
    currentIndex.value++;
    isZoomed.value = false;
  }
};

const prev = () => {
  if (hasPrev.value) {
    currentIndex.value--;
    isZoomed.value = false;
  }
};

const close = () => {
  emit('close');
};

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      prev();
      break;
    case 'Escape':
      close();
      break;
    case ' ':
      e.preventDefault();
      toggleZoom();
      break;
  }
};

// Touch/swipe handling
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value;
  const threshold = 50;
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }
  
  touchStartX.value = 0;
  touchEndX.value = 0;
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Close button -->
      <button 
        @click="close"
        class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Counter -->
      <div class="absolute top-4 left-4 text-white/70 text-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Main image -->
      <div class="flex items-center justify-center h-full p-4 sm:p-8">
        <img
          :src="currentImage.src"
          :alt="currentImage.alt || ''"
          class="max-h-full max-w-full object-contain transition-transform duration-300 cursor-zoom-in"
          :class="isZoomed ? 'scale-150 cursor-zoom-out' : ''"
          @click="toggleZoom"
        />
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="hasPrev"
        @click="prev"
        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Previous"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="hasNext"
        @click="next"
        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Next"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Thumbnail strip -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-full overflow-x-auto">
        <button
          v-for="(img, idx) in images"
          :key="idx"
          @click="currentIndex = idx; isZoomed = false"
          class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200"
          :class="idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'"
        >
          <img :src="img.src" :alt="img.alt || ''" class="w-full h-full object-cover" />
        </button>
      </div>

      <!-- Keyboard hints -->
      <div class="hidden sm:block absolute bottom-4 right-4 text-white/40 text-xs">
        ← → Navigate • Space Zoom • Esc Close
      </div>
    </div>
  </Teleport>
</template>
