<script setup lang="ts">
const { notifications, remove } = useToast()

const iconMap = {
  success: 'heroicons:check-circle-20-solid',
  error: 'heroicons:x-circle-20-solid',
  info: 'heroicons:information-circle-20-solid',
  warning: 'heroicons:exclamation-triangle-20-solid',
}

const colorMap = {
  success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
}
</script>

<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
  >
    <TransitionGroup name="toast">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-center gap-3 p-4 rounded-lg border shadow-lg pointer-events-auto max-w-md',
          colorMap[notification.type]
        ]"
        role="alert"
      >
        <Icon
          :name="iconMap[notification.type]"
          class="w-5 h-5 flex-shrink-0"
        />
        <p class="flex-1 text-sm font-medium">
          {{ notification.message }}
        </p>
        <button
          @click="remove(notification.id)"
          class="flex-shrink-0 hover:opacity-75 transition-opacity"
          :aria-label="`Close ${notification.type} notification`"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
