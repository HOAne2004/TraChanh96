// src/stores/authStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(phone, password) {
      try {
        this.loading = true
        this.error = null

        // 🔹 Gọi API giả (hoặc thật)
        const res = await axios.get('http://localhost:3000/users', {
          params: { phone, password }
        })

        if (res.data.length === 0) {
          throw new Error('Sai số điện thoại hoặc mật khẩu')
        }

        const user = res.data[0]

        // 🔹 Lưu user và token vào localStorage
        this.user = user
        this.token = user.token
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', user.token)

        // 🔹 Điều hướng theo vai trò
        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } catch (err) {
        this.error = err.message || 'Đăng nhập thất bại'
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/') // quay về trang chủ
    }
  }
})
