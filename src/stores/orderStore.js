import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  placeOrder,
  fetchUserOrders,
  fetchAllOrdersForAdmin, // Thêm
  updateOrderStatus, // Thêm
} from '@/apis/orderApi'
import { useModalStore } from './modalStore'

// Giả định bạn có userStore để lấy token hoặc userId nếu cần
// import { useUserStore } from './userStore'

export const useOrderStore = defineStore('order', () => {
  // Stores
  const modalStore = useModalStore()

  // --- STATE ---
  const orders = ref([])
  const allOrders = ref([]) // 🚨 ADMIN: Danh sách tất cả đơn hàng
  const totalOrdersCount = ref(0) // 🚨 ADMIN: Tổng số đơn hàng (cho phân trang)
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---

  /**
   * Hành động đặt hàng (Gọi API và xử lý kết quả)
   * @param {object} orderData - Dữ liệu đơn hàng từ CheckoutView
   * @returns {Promise<object>} Đơn hàng đã được tạo trên server
   */
  async function placeOrderAction(orderData) {
    isLoading.value = true
    error.value = null

    try {
      // 1. Gọi API để gửi đơn hàng
      const newOrder = await placeOrder(orderData)

      // 2. Cập nhật state (thêm đơn hàng mới vào danh sách nếu cần)
      // orders.value.unshift(newOrder) // Chỉ thêm nếu bạn muốn hiển thị ngay

      // 3. Thông báo thành công (View sẽ đảm nhận)
      return newOrder
    } catch (err) {
      console.error('OrderStore: Lỗi đặt hàng:', err)
      error.value = 'Không thể hoàn tất đơn hàng. Vui lòng kiểm tra kết nối.'
      throw err // Ném lỗi để CheckoutView có thể bắt và xử lý.
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Tải danh sách đơn hàng của người dùng (Chức năng tương lai)
   */
  async function fetchOrdersAction(userId) {
    isLoading.value = true
    error.value = null

    try {
      const userOrders = await fetchUserOrders(userId)
      orders.value = userOrders
    } catch (err) {
      console.error('OrderStore: Lỗi tải đơn hàng:', err)
      error.value = 'Lỗi khi tải lịch sử đơn hàng.'
    } finally {
      isLoading.value = false
    }
  }

  // --- ACTIONS ADMIN (BỔ SUNG) ---

  /** 3. ADMIN: Tải tất cả đơn hàng cho trang quản trị */
  async function fetchAllOrdersAction(params = {}) {
    isLoading.value = true // Sử dụng chung isLoading
    error.value = null

    try {
      const { data, totalCount } = await fetchAllOrdersForAdmin(params)

      allOrders.value = data
      totalOrdersCount.value = parseInt(totalCount || 0, 10)
    } catch (err) {
      console.error('OrderStore: Lỗi tải tất cả đơn hàng:', err)
      error.value = 'Lỗi khi tải danh sách đơn hàng quản trị.'
      modalStore.showToast(error.value, 'error')
    } finally {
      isLoading.value = false
    }
  }

  /** 4. ADMIN: Cập nhật trạng thái đơn hàng */
  async function updateOrderStatusAction(orderId, newStatus) {
    isLoading.value = true
    error.value = null

    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus)

      // Cập nhật State: Tìm và thay thế đơn hàng trong allOrders
      const index = allOrders.value.findIndex((o) => String(o.id) === String(orderId))
      if (index !== -1) {
        // Thay thế dữ liệu đơn hàng đã cập nhật
        allOrders.value[index] = updatedOrder
      }

      modalStore.showToast(
        `Cập nhật trạng thái đơn hàng #${orderId} thành công: ${newStatus}`,
        'success',
      )
      return updatedOrder
    } catch (err) {
      console.error('OrderStore: Lỗi cập nhật trạng thái:', err)
      error.value = 'Không thể cập nhật trạng thái đơn hàng.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }
  // --- RETURN ---
  return {
    orders,
    allOrders, // 🚨 EXPORT MỚI
    totalOrdersCount, // 🚨 EXPORT MỚI
    isLoading,
    error,
    placeOrderAction,
    fetchOrdersAction, // Đổi tên để tránh xung đột với tên hàm mới
    fetchAllOrdersAction, // 🚨 EXPORT MỚI
    updateOrderStatusAction, // 🚨 EXPORT MỚI
  }
})
