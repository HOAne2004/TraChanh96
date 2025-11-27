import api from './index'

const ORDERS_ENDPOINT = 'api/orders' // Endpoint chung cho đơn hàng

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
    const response = await api.post(ORDERS_ENDPOINT, finalOrder)

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
    const response = await api.get(ORDERS_ENDPOINT, {
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

// --- ADMIN ACTIONS (BỔ SUNG) ---

/**
 * Tải TẤT CẢ đơn hàng cho Admin. Hỗ trợ tìm kiếm, phân trang và lọc.
 * @param {object} params - Tham số truy vấn (q, _page, _limit, status...)
 * @returns {Promise<Array<object>>} Danh sách đơn hàng
 */
export async function fetchAllOrdersForAdmin(params = {}) {
  try {
    // Json-server sẽ tự động xử lý các tham số như _page, _limit, status=...
    const response = await api.get(ORDERS_ENDPOINT, { params })

    console.log(`API: Tải ${response.data.length} đơn hàng cho Admin thành công.`)
    // 💡 Trả về cả headers để Store có thể lấy X-Total-Count cho phân trang
    return {
      data: response.data,
      totalCount: response.headers['x-total-count'], // Json-server header
    }
  } catch (error) {
    console.error('❌ Lỗi tải danh sách đơn hàng Admin:', error.response?.data || error.message)
    throw new Error('Lỗi khi tải danh sách đơn hàng từ máy chủ.')
  }
}

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 * @param {string} orderId - ID của đơn hàng
 * @param {string} newStatus - Trạng thái mới (Ví dụ: 'Processing', 'Delivered')
 * @returns {Promise<object>} Đơn hàng đã được cập nhật
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    // Sử dụng PATCH để chỉ cập nhật trường status
    const response = await api.patch(`${ORDERS_ENDPOINT}/${orderId}`, {
      status: newStatus,
      updatedAt: new Date().toISOString(), // Cập nhật thời gian thay đổi
    })
    return response.data
  } catch (error) {
    console.error(
      `❌ Lỗi cập nhật trạng thái đơn hàng ${orderId}:`,
      error.response?.data || error.message,
    )
    throw new Error('Cập nhật trạng thái đơn hàng thất bại.')
  }
}
