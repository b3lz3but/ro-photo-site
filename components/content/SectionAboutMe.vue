<script setup lang="ts">
import type { Image } from "../../types/image";
defineProps({
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  photo: {
    type: Object as PropType<Image>,
    required: false,
  },
});
</script>
<template>
  <div class="not-prose mt-12 sm:mt-16 lg:mt-48 px-4 sm:px-0 content-visibility-visible contain-intrinsic-size-[auto_750px]">
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:gap-8">
      <!-- Photo - centered on mobile, right side on desktop -->
      <div
        v-parallax
        data-rellax-xs-speed="0"
        data-rellax-mobile-speed="0"
        data-rellax-tablet-speed="0"
        data-parallax-speed="-1"
        data-rellax-percentage="0.5"
        class="col-span-1 lg:col-span-3 order-1 flex justify-center lg:justify-start lg:order-2 lg:pl-2 lg:pt-2"
      >
        <div class="lg:absolute aspect-square sm:aspect-[3/4] lg:aspect-[2/3] flex-none overflow-hidden bg-zinc-100 dark:bg-zinc-800 w-48 sm:w-56 lg:w-72 rounded-2xl rotate-3 shadow-lg">
          <NuxtImg
            placeholder
            :src="photo?.src ? photo.src : 'img/placeholder.jpg'"
            :alt="photo?.alt ? photo.alt : 'Ciprian Rădulescu'"
            :width="photo?.width ? photo.width : 1"
            :height="photo?.height ? photo.height : 1"
            format="webp"
            loading="lazy"
            class="h-full w-full object-cover"
            sizes="sm:50vw md:50vw lg:30vw"
          />
        </div>
      </div>

      <!-- Text content -->
      <div class="col-span-1 lg:col-span-4 flex flex-col gap-6 sm:gap-8 order-2 lg:order-1 text-center lg:text-left">
        <h2 class="text-3xl sm:text-4xl lg:text-6xl font-display text-zinc-800 dark:text-zinc-100">
          {{ firstname }} <br class="hidden sm:block" />
          <span class="sm:hidden"> </span>{{ lastname }}
        </h2>
        <div class="text-zinc-700 dark:text-zinc-300 flex flex-col gap-4 text-sm sm:text-base leading-relaxed">
          <slot name="description"></slot>
        </div>
      </div>
    </div>

    <hr class="my-8 sm:my-10 h-px border-0 bg-zinc-200 dark:bg-zinc-800" />
    <slot name="extra"></slot>
  </div>
</template>
