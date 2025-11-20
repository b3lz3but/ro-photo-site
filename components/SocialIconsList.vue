<script setup lang="ts">
type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

const props = defineProps({
  links: {
    type: Array as PropType<SocialLink[]>,
    default: () => [
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/b3lz3but/',
        icon: 'fe:instagram'
      },
      {
        name: 'Email',
        url: 'mailto:ciprian.radulescu85@gmail.com',
        icon: 'heroicons:envelope-20-solid'
      }
    ]
  },
  iconSize: {
    type: String,
    default: '1.5rem'
  }
});
</script>

<template>
  <ul class="flex items-center gap-4">
    <li v-for="link in links" :key="link.url">
      <a
        :href="link.url"
        :aria-label="link.name"
        class="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon :name="link.icon" :size="iconSize" />
      </a>
    </li>
  </ul>
</template>
