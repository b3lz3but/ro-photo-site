<script setup lang="ts">
import { Bars2Icon, XMarkIcon } from "@heroicons/vue/20/solid";

const { links } = defineProps<{
  links: { name: string; to: string }[];
}>();

const { isActive } = useActiveLink();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

// Close menu on route change
const route = useRoute();
watch(() => route.path, () => closeMenu());

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <div>
    <!-- Menu Toggle Button -->
    <button
      @click="toggleMenu"
      class="relative z-50 border rounded-full px-2 py-2 transition-all duration-300"
      :class="[
        isOpen 
          ? 'text-white border-white/20 bg-zinc-900' 
          : 'text-zinc-500 border-zinc-500 hover:bg-white hover:text-zinc-900 hover:border-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white dark:hover:border-zinc-700'
      ]"
      :aria-expanded="isOpen"
      aria-label="Toggle menu"
    >
      <Transition
        enter-active-class="transition-transform duration-200"
        enter-from-class="rotate-90 opacity-0"
        enter-to-class="rotate-0 opacity-100"
        leave-active-class="transition-transform duration-200"
        leave-from-class="rotate-0 opacity-100"
        leave-to-class="-rotate-90 opacity-0"
        mode="out-in"
      >
        <XMarkIcon v-if="isOpen" class="h-4 w-4" aria-hidden="true" />
        <Bars2Icon v-else class="h-4 w-4" aria-hidden="true" />
      </Transition>
    </button>

    <!-- Fullscreen Overlay Menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-xl"
        >
          <div class="flex flex-col items-center justify-center h-full">
            <nav class="flex flex-col items-center gap-2">
              <TransitionGroup
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <NuxtLink
                  v-for="(link, index) in links"
                  :key="link.to"
                  :to="link.to"
                  :style="{ transitionDelay: `${index * 75}ms` }"
                  :aria-current="isActive(link.to) ? 'page' : undefined"
                  class="group relative px-8 py-4 text-3xl font-display font-light transition-colors"
                  :class="[
                    isActive(link.to) 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:text-white'
                  ]"
                  @click="closeMenu"
                >
                  <span class="relative z-10">{{ link.name }}</span>
                  <!-- Active/hover background -->
                  <span 
                    :class="[
                      'absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 transition-opacity duration-300',
                      isActive(link.to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    ]"
                  />
                </NuxtLink>
              </TransitionGroup>
            </nav>
            
            <!-- Social links or other content at bottom -->
            <div class="absolute bottom-12 text-zinc-500 text-sm">
              Fixed Focused Designs
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
