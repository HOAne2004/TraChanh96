import { defineStore } from 'pinia'
import { ref } from 'vue'
// 🚨 Import API service
import { placeOrder, fetchUserOrders } from '@/api/orderApi'

// Giả định bạn có userStore để lấy token hoặc userId nếu cần
// import { useUserStore } from './userStore'

export const useOrderStore = defineStore('order', () => {
  // --- STATE ---
  const orders = ref([])
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

  // --- RETURN ---
  return {
    orders,
    isLoading,
    error,
    placeOrderAction,
    fetchOrdersAction,
  }
})
