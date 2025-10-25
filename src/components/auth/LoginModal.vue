<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import LoginForm from './LoginForm.vue'

const modal = useModalStore()
</script>

<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="modal.isLoginModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="modal.closeLoginModal"
    >
      <!-- Modal content -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-11/12 max-w-md">
        <h2 class="text-xl font-semibold mb-4 text-center">Đăng nhập</h2>
        <LoginForm />

        <button
          @click="modal.closeLoginModal"
          class="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Đóng
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
