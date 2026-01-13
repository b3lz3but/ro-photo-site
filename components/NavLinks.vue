<script setup lang="ts">
const { links } = defineProps<{
  links: { name: string; to: string }[];
}>();

const { isActive } = useActiveLink();
</script>

<template>
  <ul class="flex items-center gap-1">
    <li v-for="link in links" :key="link.to" class="relative">
      <NuxtLink
        :to="link.to"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        :class="[
          'relative px-3 py-2 text-sm font-medium transition-colors duration-200',
          isActive(link.to) 
            ? 'text-zinc-900 dark:text-white' 
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white',
        ]"
      >
        {{ link.name }}
        <!-- Animated underline indicator -->
        <span 
          :class="[
            'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-300',
            isActive(link.to) ? 'w-4/5 opacity-100' : 'w-0 opacity-0'
          ]"
        />
      </NuxtLink>
    </li>
  </ul>
</template>
