<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String,
})

const visible = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      visible.value = true
      setTimeout(() => {
        visible.value = false
      }, 3000)
    }
  },
)
</script>
<template>
  <Transition name="notification">
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800 p-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ message }}
          </p>
        </div>
        <button
          @click="visible = false"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
