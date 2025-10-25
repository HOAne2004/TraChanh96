<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'

const phone = ref('')
const password = ref('')
const showPassword = ref(false)

const modal = useModalStore()
const auth = useAuthStore()

const handleLogin = async () => {
  await auth.login(phone.value, password.value)

  if (auth.error) {
    alert(auth.error)
  } else {
    modal.closeLoginModal()
  }
}
</script>

<template>
  <div class="relative">
    <!-- Nút đóng -->
    <button
      type="button"
      class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
      @click="modal.closeLoginModal"
    >
      &times;
    </button>

    <form @submit.prevent="handleLogin" class="space-y-4 pt-6">
      <div>
        <label for="phone" class="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          id="phone"
          type="text"
          inputmode="tel"
          v-model.trim="phone"
          required
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300 outline-none"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div class="relative">
        <label for="password" class="block text-sm font-medium mb-1">Mật khẩu</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model.trim="password"
          required
          class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-green-300 outline-none"
          placeholder="Nhập mật khẩu"
        />
        <button
          type="button"
          class="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <span v-if="showPassword">👁️‍🗨️</span>
          <span v-else>👁️</span>
        </button>
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        <span v-if="auth.loading">Đang đăng nhập...</span>
        <span v-else>Đăng nhập</span>
      </button>
    </form>
  </div>
</template>
