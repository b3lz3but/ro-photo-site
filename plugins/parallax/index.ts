import Rellax from "rellax";

export default defineNuxtPlugin((nuxtApp) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = process.client
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  nuxtApp.vueApp.directive("parallax", {
    mounted(el, binding, vnode, prevVnode) {
      // Only enable parallax if user doesn't prefer reduced motion
      if (!prefersReducedMotion) {
        Rellax(el, {
          round: true,
        });
      }
    },
  });
});
