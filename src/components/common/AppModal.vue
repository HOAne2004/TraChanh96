<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Thông báo' },
  maxWidth: { type: String, default: 'max-w-xl' }, // Ví dụ: max-w-lg, max-w-4xl
})

const emit = defineEmits(['close'])

// Hàm đóng modal
const closeModal = () => {
  emit('close')
}

// Xử lý sự kiện nhấn phím ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Thêm/Xóa listener khi component mount/unmount
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Tùy chọn: Ngăn cuộn trang khi modal mở
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        @click="closeModal"
      ></div>

      <div
        :class="[
          'bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative w-full overflow-hidden transition-all',
          maxWidth,
        ]"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Đóng"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto max-h-[80vh]">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition Styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
