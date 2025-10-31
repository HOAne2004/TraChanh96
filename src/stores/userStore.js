// src/stores/userStore.js (STORE CHÍNH CHO AUTH & USER DATA)
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import router from '@/router'
import { useCartStore } from './cartStore' // Import để xử lý giỏ hàng

export const useUserStore = defineStore('user', () => {
  // 🧩 STATE
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null) // Giữ token riêng
  const loading = ref(false)
  const error = ref(null)

  // 🔎 GETTERS
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin') // Tích hợp logic isAdmin

  // 🧭 HELPER FUNCTIONS (Logic quản lý trạng thái user nội bộ)
  const setAuthData = (userData) => {
    user.value = userData
    token.value = userData.token || 'mock_token'
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token.value)
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 📦 ACTIONS

  /** 1. ĐĂNG NHẬP */
  const login = async (phone, password) => {
    loading.value = true
    error.value = null
    try {
      const userData = await authApi.login(phone, password)

      // 🚨 BƯỚC MỚI: TẢI GIỎ HÀNG SAU KHI ĐĂNG NHẬP
      const cartStore = useCartStore()
      await cartStore.loadCartFromServer(userData.id) // Tải giỏ hàng của User

      setAuthData(userData) // Lưu user và token

      // Điều hướng theo vai trò
      if (userData.role === 'admin') {
        router.push('/admin')
      } 
    } catch (err) {
      error.value = err.message || 'Đăng nhập thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  /** 2. ĐĂNG KÝ */
  const register = async (name, phone, password) => {
    loading.value = true
    error.value = null
    try {
      await authApi.register({ name, phone, password, role: 'user' })
      await login(phone, password) // Tự động đăng nhập sau khi đăng ký thành công
    } catch (err) {
      error.value = err.message || 'Đăng ký thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  /** 3. ĐĂNG XUẤT */
  const logout = async () => {
    // Đổi tên từ signOut thành logout
    // 🚨 BƯỚC MỚI: ĐỒNG BỘ GIỎ HÀNG TRƯỚC KHI ĐĂNG XUẤT
    if (user.value) {
      const cartStore = useCartStore()
      await cartStore.syncCartToServer(user.value.id)
      cartStore.clearCart() // Reset giỏ hàng client side
    }

    clearAuthData() // Xóa user, token
    router.push('/')
  }

  // 🔁 EXPORT
  return {
    // State & Refs
    user,
    token,
    loading,
    error,

    // Getters
    isLoggedIn,
    isAdmin,

    // Actions
    login, // Tên hàm chính thức
    logout,
    register,
  }
})
