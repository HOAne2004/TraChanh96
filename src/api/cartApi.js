import http from './http' // Sử dụng http client chung

const cartApi = {
  /**
   * Đồng bộ giỏ hàng lên server.
   */
  async syncCartToServer(userId, items) {
    if (!userId) {
      console.warn('Không có userId, bỏ qua đồng bộ giỏ hàng.')
      return
    }

    // 🚨 Trong ứng dụng thực tế, đây thường là PUT/PATCH/POST để cập nhật giỏ hàng theo userId.
    // Với JSON Server, ta chỉ POST/PUT/PATCH vào 1 endpoint chung.
    try {
      // Giả lập logic: tìm giỏ hàng cũ và cập nhật (hoặc tạo mới)
      // Dùng endpoint chung /carts cho JSON Server
      const { data: existingCarts } = await http.get(`/carts?userId=${userId}`)

      if (existingCarts.length > 0) {
        // Cập nhật giỏ hàng đã tồn tại (PUT/PATCH)
        const cartId = existingCarts[0].id
        await http.patch(`/carts/${cartId}`, {
          items: items,
          updatedAt: new Date().toISOString(),
        })
      } else {
        // Tạo giỏ hàng mới (POST)
        await http.post('/carts', {
          userId,
          items: items,
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.error('❌ Lỗi đồng bộ giỏ hàng:', err)
      throw new Error('Lỗi đồng bộ giỏ hàng lên máy chủ.')
    }
  },

  /**
   * Tải giỏ hàng từ server.
   */
  async loadCartFromServer(userId) {
    if (!userId) return null

    try {
      // Tải giỏ hàng của user
      const { data } = await http.get(`/carts?userId=${userId}`)
      if (data.length > 0) {
        return data[0].items || []
      }
      return []
    } catch (err) {
      console.error('❌ Lỗi tải giỏ hàng:', err)
      throw new Error('Lỗi tải giỏ hàng từ máy chủ.')
    }
  },
}

export default cartApi