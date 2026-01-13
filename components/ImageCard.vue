<script setup lang="ts">
interface Props {
  src: string;
  alt?: string;
  title?: string;
  aspectRatio?: string;
  to?: string;
}

withDefaults(defineProps<Props>(), {
  alt: "",
  title: "",
  aspectRatio: "3/4",
});

const isLoaded = ref(false);
const isHovered = ref(false);
</script>

<template>
  <component 
    :is="to ? 'NuxtLink' : 'div'" 
    :to="to"
    class="group relative block overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
    :style="{ aspectRatio }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Skeleton while loading -->
    <div 
      v-if="!isLoaded"
      class="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-700"
    />
    
    <!-- Image with zoom effect -->
    <NuxtImg
      :src="src"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
      :class="[isHovered ? 'scale-110' : 'scale-100']"
      loading="lazy"
      format="webp"
      quality="80"
      @load="isLoaded = true"
    />
    
    <!-- Gradient overlay -->
    <div 
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-300"
      :class="[isHovered ? 'opacity-100' : 'opacity-0']"
    />
    
    <!-- Title overlay -->
    <div 
      v-if="title"
      class="absolute inset-x-0 bottom-0 p-4 transition-all duration-300"
      :class="[isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0']"
    >
      <h3 class="text-white font-medium text-lg drop-shadow-lg">{{ title }}</h3>
    </div>

    <!-- Corner icon -->
    <div 
      class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
      :class="[isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75']"
    >
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
      </svg>
    </div>
  </component>
</template>
