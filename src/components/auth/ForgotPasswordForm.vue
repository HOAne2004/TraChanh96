<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const phone = ref('')
const message = ref('')
const auth = useUserStore()

// 🚨 Giả định action này tồn tại trong authStore (hoặc chỉ mô phỏng tại component này)
const handleForgotPassword = async () => {
  // 1. Reset trạng thái lỗi/loading
  auth.loading = true
  auth.error = null
  message.value = ''

  try {
    // 🚨 Trong thực tế, bạn sẽ gọi API ở đây: await authApi.forgotPassword(phone.value)
    
    // Giả lập thành công: Kiểm tra nếu SĐT hợp lệ (ví dụ: có 10 chữ số)
    if (phone.value.length < 10) {
        throw new Error('Số điện thoại không hợp lệ.')
    }

    // Giả lập độ trễ API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    message.value = '✅ Yêu cầu khôi phục đã được gửi. Vui lòng kiểm tra tin nhắn/email.'

  } catch (err) {
    auth.error = err.message || 'Lỗi gửi yêu cầu. Vui lòng thử lại.'
  } finally {
    auth.loading = false
  }
}
</script>

<template>
  <div class="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold mb-4 text-center">Khôi phục Mật khẩu</h2>
    <p class="mb-4 text-sm text-center text-gray-500 dark:text-gray-300">
        Vui lòng nhập số điện thoại của bạn để nhận liên kết khôi phục.
    </p>
    
    <div v-if="auth.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
        {{ auth.error }}
    </div>
    <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
        {{ message }}
    </div>


    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      
      <div>
        <label for="phone" class="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          id="phone"
          type="text"
          inputmode="tel"
          v-model.trim="phone"
          required
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300 outline-none dark:bg-gray-700 dark:border-gray-600"
          placeholder="Nhập số điện thoại đã đăng ký"
        />
      </div>

      <button
        type="submit"
        :disabled="auth.loading || !!message"
        class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        <span v-if="auth.loading">Đang gửi...</span>
        <span v-else>Gửi yêu cầu khôi phục</span>
      </button>
    </form>
    
    <div class="mt-4 text-center text-sm">
        <RouterLink to="/" class="text-green-600 hover:underline font-medium">
            Quay lại Đăng nhập
        </RouterLink>
    </div>
  </div>
</template>