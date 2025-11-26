<script setup>
import { ref, computed } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useRouter } from 'vue-router'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue' 

const modal = useModalStore()
const router = useRouter()

// 🚨 Quản lý trạng thái tab: 'login', 'register', 'forgot'
const activeTab = ref('login')

// Chuyển sang trang Đăng ký (Page riêng)
const goToRegisterPage = () => {
    modal.closeLoginModal()
    router.push('/register')
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="modal.isLoginModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="modal.closeLoginModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-11/12 max-w-md">
        <div class="relative">
          <button
            type="button"
            class="absolute top-0 right-0 text-gray-500 hover:text-gray-800 text-xl"
            @click="modal.closeLoginModal"
          >
            &times;
          </button>

          <h2 class="text-2xl font-bold mb-4 text-center">
             {{ activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký' }} 
          </h2>
          <p v-if="activeTab === 'login'" class="text-sm text-center text-gray-500 mb-4">
            Đăng nhập bằng Email của bạn
          </p>

          <LoginForm />
          
          <div class="mt-4 text-center text-sm space-y-2">
            <p>
              Chưa có tài khoản? 
              <button @click="goToRegisterPage" class="text-green-600 hover:underline font-medium">
                Đăng ký ngay
              </button>
            </p>
            <p>
              <RouterLink to="/forgot-password" @click="modal.closeLoginModal" class="text-gray-500 hover:underline">
                Quên mật khẩu?
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>