<script setup lang="ts">
const { links } = defineProps<{
  links: { name: string; to: string }[];
}>();

const { isActive } = useActiveLink();
</script>

<template>
  <ul class="flex items-center gap-4">
    <li v-for="link in links" :key="link.to">
      <NuxtLink
        :to="link.to"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        :class="[
          isActive(link.to) ? 'text-gradient' : 'text-zinc-700 dark:text-zinc-400',
          'px-2 hover:text-zinc-900 dark:hover:text-zinc-200',
        ]"
      >
        {{ link.name }}
      </NuxtLink>
    </li>
  </ul>
</template>
