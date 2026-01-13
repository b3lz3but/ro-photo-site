<template>
  <div class="not-prose px-4 sm:px-0">
    <div class="relative px-4 sm:px-6 py-10 sm:py-12 lg:py-24 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-yellow-100/5 shadow-sm dark:shadow-2xl">
      <div class="relative z-10">
        <h2 class="font-display font-thin text-2xl sm:text-3xl lg:text-4xl max-w-2xl mx-auto text-center text-zinc-900 dark:text-gradient leading-relaxed">
          <slot name="title">Questions or collaboration ideas?</slot>
        </h2>
        <div class="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-lg mx-auto text-center text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
          <slot name="description">
            <p>I would love to hear from you! Whether you have questions about my work, have collaboration ideas, or are interested in hiring me for a project, don't hesitate to reach out.</p>
            <p>I usually respond within hours!</p>
          </slot>
        </div>
        <ul class="mt-10 sm:mt-16 flex flex-col gap-6 sm:gap-4 lg:gap-12 lg:flex-row items-center justify-center max-w-2xl mx-auto">
          <li>
            <a href="mailto:ciprian.radulescu85@gmail.com" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors underline decoration-zinc-400 dark:decoration-zinc-500 hover:decoration-zinc-600 dark:hover:decoration-zinc-300">
              <Icon name="heroicons:envelope-20-solid" size="1.5rem" class="sm:w-7 sm:h-7" />
              <span>Email</span>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/b3lz3but/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors underline decoration-zinc-400 dark:decoration-zinc-500 hover:decoration-zinc-600 dark:hover:decoration-zinc-300">
              <Icon name="fe:instagram" size="1.5rem" class="sm:w-7 sm:h-7" />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a href="tel:+40721354125" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors underline decoration-zinc-400 dark:decoration-zinc-500 hover:decoration-zinc-600 dark:hover:decoration-zinc-300">
              <Icon name="fe:phone" size="1.5rem" class="sm:w-7 sm:h-7" />
              <span>+40 721 354 125</span>
            </a>
          </li>
        </ul>
      </div>
      <svg viewBox="0 0 1024 1024" class="hidden dark:block absolute top-1/2 left-1/2 h-[64rem] w-[64rem] -translate-x-1/2 pointer-events-none" aria-hidden="true">
        <circle cx="512" cy="512" r="512" fill="url(#gradient-dark-cta)" fill-opacity="0.7"></circle>
        <defs>
          <radialGradient id="gradient-dark-cta" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 512) rotate(90) scale(512)">
            <stop stop-color="#18181B"></stop>
            <stop offset="1" stop-color="#333626" stop-opacity="0"></stop>
          </radialGradient>
        </defs>
      </svg>
      <svg viewBox="0 0 1024 1024" class="dark:hidden absolute top-1/2 left-1/2 h-[64rem] w-[64rem] -translate-x-1/2 pointer-events-none" aria-hidden="true">
        <circle cx="512" cy="512" r="512" fill="url(#gradient-light-cta)" fill-opacity="0.7"></circle>
        <defs>
          <radialGradient id="gradient-light-cta" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 512) rotate(90) scale(512)">
            <stop stop-color="#F0F0F0"></stop>
            <stop offset="1" stop-color="#F3E0AD" stop-opacity="0"></stop>
          </radialGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>
