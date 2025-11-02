import http from './http' // 🚨 Đã sử dụng http client (Axios instance)

const ORDERS_ENDPOINT = '/orders' // Endpoint chung cho đơn hàng

/**
 * Gửi dữ liệu đơn hàng lên server
 * @param {object} orderData - Dữ liệu chi tiết đơn hàng
 * @returns {Promise<object>} Đơn hàng đã tạo
 */
export async function placeOrder(orderData) {
  console.log('API: Đang gọi API đặt hàng...')

  // Thêm các thông tin cần thiết trước khi gửi lên server
  const finalOrder = {
    ...orderData,
    status: 'Pending', // Trạng thái mặc định
    createdAt: new Date().toISOString(),
  }

  try {
    // 🚨 Dùng Axios POST để tạo đơn hàng
    const response = await http.post(ORDERS_ENDPOINT, finalOrder)

    console.log('API: Đặt hàng thành công! (Axios)')
    return response.data
  } catch (error) {
    console.error('❌ Lỗi đặt hàng:', error.response?.data || error.message)
    // Ném lỗi với thông báo thân thiện hơn
    throw new Error('Lỗi đặt hàng. Vui lòng kiểm tra lại thông tin và thử lại.')
  }
}

/**
 * Tải lịch sử đơn hàng của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array<object>>} Danh sách đơn hàng
 */
export async function fetchUserOrders(userId) {
  if (!userId) {
    // Ném lỗi nếu thiếu ID, quan trọng cho việc debug
    throw new Error('Không thể tải đơn hàng khi thiếu User ID.')
  }

  try {
    // 🚨 Dùng Axios GET để tải đơn hàng của userId cụ thể
    const response = await http.get(ORDERS_ENDPOINT, {
      params: {
        userId: userId,
        _sort: 'createdAt', // Sắp xếp theo ngày tạo (JSON Server)
        _order: 'desc', // Giảm dần (mới nhất lên đầu)
      },
    })

    console.log(`API: Tải ${response.data.length} đơn hàng thành công.`)
    return response.data
  } catch (error) {
    console.error('❌ Lỗi tải lịch sử đơn hàng:', error.response?.data || error.message)
    throw new Error('Lỗi khi tải lịch sử đơn hàng từ máy chủ.')
  }
}
