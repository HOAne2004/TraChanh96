// src/stores/userStore.js
import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import * as authApi from '@/apis/authApi'
import api from '@/apis/index'
import { useModalStore } from './modalStore'

export const useUserStore = defineStore('user', () => {
  // state (persist token/user to localStorage for page reload)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)
  const allUsers = ref([])
  const usersLoading = ref(false)
  const totalUsersCount = ref(0)

  const modalStore = useModalStore()

  // computed
  const isLoggedIn = computed(() => !!token.value)
  // If backend returns role_id numeric use that; else if string role -> handle both
  const isAdmin = computed(() => {
    if (!user.value) return false
    if ('role_id' in user.value) return user.value.role_id === 2
    if (user.value.role) return String(user.value.role).toLowerCase() === 'admin'
    return false
  })

  // helpers for localStorage + token header cleanup
  function persistAuthData(userData, tokenData) {
    user.value = userData ?? null
    token.value = tokenData ?? null
    if (userData) localStorage.setItem('user', JSON.stringify(userData))
    else localStorage.removeItem('user')
    if (tokenData) localStorage.setItem('token', tokenData)
    else localStorage.removeItem('token')
  }

  function clearAuthDataLocal() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // also clear any default header (defensive)
    try {
      if (api.defaults && api.defaults.headers) {
        delete api.defaults.headers.common.Authorization
      }
    } catch (e) {
      // ignore
    }
  }

  /**
   * fetchCurrentUser: gọi /users/me để lấy thông tin user.
   * Nếu token không hợp lệ sẽ ném lỗi để caller xử lý.
   */
  async function fetchCurrentUser() {
    if (!token.value) return null
    loading.value = true
    error.value = null
    try {
      const userData = await authApi.getMe()
      // nếu getMe trả về object với wrapper { data: {...} }
      const payload = userData?.data ?? userData
      persistAuthData(payload, token.value)
      return payload
    } catch (err) {
      // token không hợp lệ hoặc lỗi khác
      // logout local and bubble error
      await safeLogout({ redirect: false })
      error.value = err?.message || 'Không thể xác thực'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * login: gọi authApi.login, lưu token, lấy user, sync cart
   * @param {string} emailOrUsername
   * @param {string} password
   */
  async function login(emailOrUsername, password) {
    loading.value = true
    error.value = null
    try {
      // 1) gọi login API -> nhận token string
      const tokenString = await authApi.login({ email: emailOrUsername, password })
      if (!tokenString) throw new Error('Không nhận được token từ server.')

      // 2) lưu token ngay (để interceptor dùng)
      token.value = tokenString
      localStorage.setItem('token', tokenString)

      // 3) lấy thông tin user bằng token
      const userPayload = await fetchCurrentUser()
      if (!userPayload) throw new Error('Không thể lấy thông tin người dùng sau khi đăng nhập.')
      await nextTick()
      // 4) Sync cart: tải cart từ server (nếu store có method fetchCart)
      try {
        const { useCartStore } = await import('@/stores/cartStore')
        const cartStore = useCartStore()
        if (cartStore?.fetchCart) {
          await cartStore.fetchCart()
        }
      } catch (e) {
        // không bắt buộc — chỉ log
        console.warn('Không thể sync giỏ hàng khi login:', e)
      }

      // 5) show toast và điều hướng (caller/modal store có thể hiển thị)
      // lưu auth (user + token) đã được thực hiện trong fetchCurrentUser (persistAuthData)
      // redirect
      if (isAdmin.value) {
        router.push('/admin').catch(() => {})
      } else {
        router.push('/').catch(() => {})
      }

      return userPayload
    } catch (err) {
      // chuẩn hoá lỗi
      const message = err?.message || err?.response?.data || 'Đăng nhập thất bại'
      error.value = message
      clearAuthDataLocal()
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  /**
   * register: gọi API register (trả về user hoặc success), sau đó login
   * registerDto should include email & password
   */
  async function register(registerDto) {
    loading.value = true
    error.value = null
    try {
      await authApi.register(registerDto)
      // auto-login after register
      const email = registerDto.email ?? registerDto.username
      await login(email, registerDto.password)
    } catch (err) {
      const message = err?.message || err?.response?.data || 'Đăng ký thất bại'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  /**
   * logout: public function. optionally redirect to home.
   */
  async function logout({ redirect = true } = {}) {
    // call safeLogout wrapper which resets cart + auth
    await safeLogout({ redirect })
  }

  // internal helper that resets cart state and clears auth safely
  async function safeLogout({ redirect = true } = {}) {
    loading.value = true
    try {
      // reset cart store if exists
      try {
        const { useCartStore } = await import('@/stores/cartStore')
        const cartStore = useCartStore()
        if (cartStore?.resetCartState) {
          cartStore.resetCartState()
        } else {
          // fallback: clear cart object if present
          cartStore.cart = null
        }
      } catch (e) {
        // ignore if cart store not available
      }

      // clear auth data locally
      clearAuthDataLocal()

      if (redirect) {
        router.push('/').catch(() => {})
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchUsersForAdmin() {
    if (allUsers.value.length) return // Tránh gọi lại

    usersLoading.value = true
    try {
      // Giả định bạn có hàm authApi.fetchUsersForAdmin()
      const users = await authApi.fetchUsersForAdmin()
      allUsers.value = users
    } catch (e) {
      console.error('Lỗi tải danh sách users:', e)
    } finally {
      usersLoading.value = false
    }
  }

  // ⭐️ ACTION MỚI CHO ADMIN: Lấy danh sách tất cả người dùng
  async function fetchAllUsersForAdminAction(params = {}) {
    loading.value = true
    error.value = null

    try {
      // 1. Gọi API để lấy danh sách
      const response = await authApi.fetchAllUsersForAdmin(params)

      // 2. Cập nhật State
      allUsers.value = response.data
      totalUsersCount.value = response.totalCount
        ? parseInt(response.totalCount)
        : response.data.length

      return allUsers.value
    } catch (err) {
      console.error('UserStore: Lỗi tải danh sách người dùng Admin:', err)
      error.value = 'Lỗi khi tải danh sách người dùng quản trị.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ⭐️ ACTION MỚI CHO ADMIN/User: Cập nhật thông tin/vai trò/trạng thái người dùng
  async function updateUserAction(userId, updateDto) {
    loading.value = true
    error.value = null

    try {
      // 1. Gọi API cập nhật
      const updatedUser = await authApi.updateUserRoleAndStatus(userId, updateDto)

      // 2. Cập nhật State: Tìm và thay thế người dùng trong allUsers (cho màn hình Admin)
      const index = allUsers.value.findIndex(
        (u) => String(u.public_id) === String(userId) || String(u.id) === String(userId),
      )
      if (index !== -1) {
        // Cập nhật dữ liệu người dùng
        allUsers.value[index] = { ...allUsers.value[index], ...updatedUser }
      }

      // 3. Nếu người dùng đang tự cập nhật mình, cập nhật luôn state `user` hiện tại
      if (
        user.value &&
        (String(user.value.public_id) === String(userId) ||
          String(user.value.id) === String(userId))
      ) {
        // Cập nhật thông tin user hiện tại và lưu vào localStorage
        persistAuthData({ ...user.value, ...updatedUser }, token.value)
      }

      modalStore.showToast(`Cập nhật người dùng #${userId} thành công.`, 'success')
      return updatedUser
    } catch (err) {
      console.error('UserStore: Lỗi cập nhật người dùng:', err)
      error.value = 'Không thể cập nhật thông tin người dùng.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  // Expose store API
  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    allUsers,
    usersLoading,
    totalUsersCount,
    login,
    logout,
    register,
    fetchCurrentUser,
    persistAuthData,
    clearAuthDataLocal,
    fetchUsersForAdmin,
    fetchAllUsersForAdminAction,
    updateUserAction,
  }
})
