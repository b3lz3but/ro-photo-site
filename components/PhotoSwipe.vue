<script setup lang="ts">
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const gallery = ref(null);
const slots = useSlots();
const defaultSlot = slots.default?.();
const children = defaultSlot?.[0]?.children;
const childrenType = Array.isArray(children) && children.length > 0 ? children[0]?.type : false;

let lightbox;

onMounted(() => {
  if (!lightbox && childrenType) {
    lightbox = new PhotoSwipeLightbox({
      gallery: gallery.value,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  }
});

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
});
</script>

<template>
  <div ref="gallery">
    <slot />
  </div>
</template>
