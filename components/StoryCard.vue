<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  cover: { src: string; alt?: string };
  to: string;
  content?: string;
}

const props = defineProps<Props>();

// Calculate estimated read time (average 200 words per minute)
const readTime = computed(() => {
  if (!props.content) return null;
  const words = props.content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
});

const isHovered = ref(false);
</script>

<template>
  <NuxtLink 
    :to="to"
    class="group block"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <article class="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
      <!-- Cover image with zoom effect -->
      <div class="aspect-[4/3] overflow-hidden">
        <NuxtImg
          :src="cover.src"
          :alt="cover.alt || title"
          class="w-full h-full object-cover transition-transform duration-700 ease-out"
          :class="isHovered ? 'scale-110' : 'scale-100'"
          loading="lazy"
          format="webp"
        />
      </div>
      
      <!-- Gradient overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-70'"
      />
      
      <!-- Content -->
      <div class="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <!-- Read time badge -->
        <div 
          v-if="readTime"
          class="inline-flex items-center gap-1 px-2 py-1 mb-3 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ readTime }} min citire
        </div>
        
        <h3 class="text-lg sm:text-xl font-display font-medium text-white mb-2 transition-transform duration-300"
            :class="isHovered ? 'translate-x-1' : ''"
        >
          {{ title }}
        </h3>
        
        <p v-if="description" class="text-sm text-white/70 line-clamp-2">
          {{ description }}
        </p>
        
        <!-- Arrow indicator -->
        <div 
          class="mt-3 flex items-center gap-2 text-sm text-yellow-400 transition-all duration-300"
          :class="isHovered ? 'translate-x-2 opacity-100' : 'opacity-0'"
        >
          <span>Citește mai mult</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
