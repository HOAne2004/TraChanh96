<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useUserStore } from '@/stores/userStore'
import SocialLoginButtons from './SocialLoginButtons.vue' // 🚨 Import Social Buttons

const phone = ref('')
const password = ref('')
const showPassword = ref(false)

const modal = useModalStore()
const auth = useUserStore()

const handleLogin = async () => {
  // 🚨 Cần dùng try/catch để bắt lỗi từ Store (authApi)
  try {
    await auth.login(phone.value, password.value)
    if (auth.user?.role === 'user') {
      modal.closeLoginModal()
    } else{
      modal.closeLoginModal()
    }
  } catch (err) {
    // Lỗi sẽ được hiển thị ngay bên dưới
    console.error('Lỗi đăng nhập:', err.message)
  }
}
</script>

<template>
  <div class="relative">
    <div
      v-if="auth.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm"
      role="alert"
    >
      {{ auth.error }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
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
          class="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <span v-if="showPassword">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </span>
          <span v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </span>
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

    <div class="mt-4 text-center relative">
      <div class="flex items-center my-4">
        <hr class="flex-grow border-gray-300" />
        <span class="px-2 text-sm text-gray-500">HOẶC</span>
        <hr class="flex-grow border-gray-300" />
      </div>
      <SocialLoginButtons />
    </div>
  </div>
</template>
