<script setup lang="ts">
interface Props {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string;
  once?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 600,
  direction: 'up',
  distance: '20px',
  once: true,
});

const element = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const getTransform = () => {
  switch (props.direction) {
    case 'up': return `translateY(${props.distance})`;
    case 'down': return `translateY(-${props.distance})`;
    case 'left': return `translateX(${props.distance})`;
    case 'right': return `translateX(-${props.distance})`;
    default: return 'none';
  }
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          if (props.once) {
            observer.unobserve(entry.target);
          }
        } else if (!props.once) {
          isVisible.value = false;
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  if (element.value) {
    observer.observe(element.value);
  }

  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div
    ref="element"
    :style="{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : getTransform(),
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>
