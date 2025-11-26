// src/api/index.js (Nội dung mới)
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

// 1. ⭐️ Trỏ baseURL đến API C# .NET
const api = axios.create({
  baseURL: 'https://trachanh96-be-production.up.railway.app/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 2. ⭐️ Interceptor để tự động đính kèm Token JWT
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Pinia state (phải gọi store bên trong interceptor)
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
