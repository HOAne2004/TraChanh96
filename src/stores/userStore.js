// src/stores/userStore.js (STORE CHÍNH CHO AUTH & USER DATA)
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import cartApi from '@/api/cartApi'
import router from '@/router'
import { useCartStore } from './cartStore'
import { useModalStore } from './modalStore'

export const useUserStore = defineStore('user', () => {
  // 🧩 STATE
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null) // Giữ token riêng
  const loading = ref(false)
  const error = ref(null)

  // 🚨 ADMIN STATE
  const allUsers = ref([]) // Danh sách tất cả người dùng cho Admin
  const usersLoading = ref(false)

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
      // 1. GỌI API LOGIN VÀ LƯU USER DATA
      const userData = await authApi.login(phone, password)

      const cartStore = useCartStore()
      const modalStore = useModalStore() // 🚨 TẠO INSTANCE MODAL STORE

      const guestItems = [...cartStore.cartItems]

      // 2. TẢI GIỎ HÀNG USER TỪ SERVER (Giỏ hàng hiện tại = Giỏ hàng Server)
      await cartStore.loadCartFromServer(userData.id)

      // 3. HỢP NHẤT: Thêm Guest Items vào Cart đã tải từ Server
      let mergedCount = 0
      guestItems.forEach((item) => {
        // addToCart sẽ tự động cộng dồn số lượng nếu trùng
        cartStore.addToCart(item)
        mergedCount++
      })

      // 4. ĐỒNG BỘ: Lưu Giỏ hàng đã hợp nhất lên Server
      await cartStore.syncCartToServer(userData.id)

      // 🚨 BƯỚC KHẮC PHỤC 5: GỬI THÔNG BÁO CHO NGƯỜI DÙNG
      if (mergedCount > 0) {
        const userName = userData.name || userData.phone || 'bạn'
        const message = `Chào ${userName}! Giỏ hàng đã được hợp nhất thành công (${mergedCount} sản phẩm mới).`
        modalStore.showToast(message, 'success', 5000) // Hiển thị 5 giây
      }

      // 6. LƯU AUTH DATA VÀ ĐIỀU HƯỚNG
      setAuthData(userData)
      if (userData.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/') // hoặc router.go(-1)
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
  /** 4. USER: CẬP NHẬT THÔNG TIN CÁ NHÂN/ĐỊA CHỈ */
  const updateProfileAction = async (updateData) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await authApi.updateProfile(user.value.id, updateData)

      // 💡 Quan trọng: Cập nhật user state cục bộ và localStorage
      setAuthData(updatedUser)

      modalStore.showToast('Cập nhật hồ sơ thành công!', 'success')
      return updatedUser
    } catch (err) {
      modalStore.showToast(err.message || 'Cập nhật hồ sơ thất bại.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- ACTIONS ADMIN ---

  /** 5. ADMIN: TẢI DANH SÁCH TẤT CẢ NGƯỜI DÙNG */
  const fetchUsersForAdmin = async (params = {}) => {
    if (usersLoading.value) return
    usersLoading.value = true
    error.value = null
    try {
      const usersList = await authApi.fetchUsers(params)
      allUsers.value = usersList
    } catch (err) {
      error.value = err.message || 'Lỗi khi tải danh sách người dùng.'
      modalStore.showToast(error.value, 'error')
    } finally {
      usersLoading.value = false
    }
  }

  /** 6. ADMIN: CẬP NHẬT DỮ LIỆU/VAI TRÒ CỦA NGƯỜI DÙNG BẤT KỲ */
  const updateUserDataAction = async (userId, updateData) => {
    usersLoading.value = true // Sử dụng usersLoading để khóa trang quản lý
    error.value = null
    try {
      const updatedUser = await authApi.updateUserData(userId, updateData)

      // Cập nhật State: Tìm và thay thế user trong allUsers
      const index = allUsers.value.findIndex((u) => String(u.id) === String(userId))
      if (index !== -1) {
        allUsers.value[index] = updatedUser
      }

      modalStore.showToast(`Cập nhật người dùng ID ${userId} thành công.`, 'success')
      return updatedUser
    } catch (err) {
      modalStore.showToast('Cập nhật người dùng thất bại.', 'error')
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  // 🔁 EXPORT
  return {
    // State & Refs
    user,
    token,
    loading,
    error,
    allUsers,
    usersLoading,

    // Getters
    isLoggedIn,
    isAdmin,

    // Actions
    login, // Tên hàm chính thức
    logout,
    register,
    fetchUsersForAdmin,
    updateUserDataAction,
    updateProfileAction,
  }
})
