// src/api/cartApi.js (NỘI DUNG MỚI)
import api from './index'

// ⭐️ Endpoint C# của chúng ta là /api/cart
const API = '/cart'

const cartApi = {
  /**
   * 1. Lấy giỏ hàng hiện tại (GET /api/cart/me)
   * (API C# trả về CartReadDto)
   */
  async getCart() {
    try {
      const { data } = await api.get(`${API}/me`)
      return data
    } catch (err) {
      console.error('❌ Lỗi tải giỏ hàng:', err)
      throw new Error('Lỗi tải giỏ hàng từ máy chủ.')
    }
  },

  /**
   * 2. Thêm một món vào giỏ (POST /api/cart/add-item)
   * @param {object} itemCreateDto (Phải khớp với CartItemCreateDto.cs)
   * (API C# trả về CartReadDto MỚI)
   */
  async addItem(itemCreateDto) {
    try {
      const { data } = await api.post(`${API}/add-item`, itemCreateDto)
      return data
    } catch (err) {
      console.error('❌ Lỗi thêm vào giỏ hàng:', err)
      throw new Error(err.response?.data || 'Lỗi thêm sản phẩm vào giỏ hàng.')
    }
  },

  /**
   * 3. Xóa một món khỏi giỏ (DELETE /api/cart/remove-item/{id})
   * @param {number} cartItemId (ID của CartItem)
   * (API C# trả về CartReadDto MỚI)
   */
  async removeItem(cartItemId) {
    try {
      const { data } = await api.delete(`${API}/remove-item/${cartItemId}`)
      return data
    } catch (err) {
      console.error('❌ Lỗi xóa khỏi giỏ hàng:', err)
      throw new Error(err.response?.data || 'Lỗi xóa sản phẩm khỏi giỏ hàng.')
    }
  },

  /**
   * 4. Xóa sạch giỏ hàng (DELETE /api/cart/clear)
   * (API C# trả về CartReadDto MỚI (rỗng))
   */
  async clearCart() {
    try {
      const { data } = await api.delete(`${API}/clear`)
      return data
    } catch (err) {
      console.error('❌ Lỗi xóa sạch giỏ hàng:', err)
      throw new Error(err.response?.data || 'Lỗi xóa sạch giỏ hàng.')
    }
  },

  /**
   * 5. Cập nhật số lượng (PUT /api/cart/update-item)
   * @param {number} cartItemId 
   * @param {number} quantity 
   */
  async updateItem(cartItemId, { quantity }) {
    try {
      // Gửi đúng cấu trúc CartItemUpdateDto
      const { data } = await api.put(`${API}/update-item`, { 
        cartItemId: cartItemId, 
        quantity: quantity 
      })
      return data
    } catch (err) {
      console.error('❌ Lỗi cập nhật số lượng:', err)
      throw new Error(err.response?.data || 'Lỗi cập nhật số lượng.')
    }
  },
}

export default cartApi
