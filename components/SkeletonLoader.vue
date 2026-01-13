<script setup lang="ts">
interface Props {
  type?: 'text' | 'image' | 'card' | 'avatar';
  lines?: number;
  aspectRatio?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  lines: 3,
  aspectRatio: '16/9',
});
</script>

<template>
  <div class="animate-pulse">
    <!-- Text skeleton -->
    <template v-if="type === 'text'">
      <div class="space-y-3">
        <div 
          v-for="i in lines" 
          :key="i" 
          class="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"
          :class="i === lines ? 'w-3/4' : 'w-full'"
        />
      </div>
    </template>

    <!-- Image skeleton -->
    <template v-else-if="type === 'image'">
      <div 
        class="bg-zinc-200 dark:bg-zinc-700 rounded-xl"
        :style="{ aspectRatio }"
      >
        <div class="flex items-center justify-center h-full">
          <svg class="w-10 h-10 text-zinc-300 dark:text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </template>

    <!-- Card skeleton -->
    <template v-else-if="type === 'card'">
      <div class="space-y-4">
        <div class="bg-zinc-200 dark:bg-zinc-700 rounded-xl" :style="{ aspectRatio }" />
        <div class="space-y-2">
          <div class="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
          <div class="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        </div>
      </div>
    </template>

    <!-- Avatar skeleton -->
    <template v-else-if="type === 'avatar'">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        <div class="space-y-2 flex-1">
          <div class="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        </div>
      </div>
    </template>
  </div>
</template>
