<template>
  <div class="not-prose lg:max-w-3xl mx-auto pt-6 sm:pt-8 lg:pt-44 px-4 sm:px-6 content-visibility-auto contain-intrinsic-size-[auto_400px]">
    <div class="flex flex-col gap-6 sm:gap-9">
      <h1 class="text-center font-display font-light leading-snug text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-zinc-800 dark:text-zinc-100">
        <slot> Inspire Emotion and Evoke Storytelling through the Art of Photography. </slot>
      </h1>
      <p class="text-zinc-700 dark:text-zinc-300 text-center text-sm sm:text-base px-2 sm:px-6 md:px-14 lg:px-24 leading-relaxed">
        <slot name="description"> Explore my photography portfolio and see the world through my creative lens. Contact me if you would like to hire me. </slot>
      </p>
    </div>
  </div>
</template>
