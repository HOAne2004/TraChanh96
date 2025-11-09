// src/api/authApi.js (ĐÃ SỬA CHỮA HOÀN TOÀN)
import http from './http'

const AUTH_ENDPOINT = '/users'

const authApi = {
  /**
   * 1. HÀM ĐĂNG NHẬP (LOGIN)
   * Mục đích: Kiểm tra SĐT và Mật khẩu có khớp không.
   * @throws {Error} Nếu xác thực thất bại.
   */
  async login(phone, password) {
    try {
      // 🚨 LOGIN LOGIC: Tìm user khớp cả SĐT và Mật khẩu
      const res = await http.get(AUTH_ENDPOINT, {
        params: {
          phone: phone,
          password: password,
        },
      })

      if (res.data && res.data.length > 0) {
        // Trả về dữ liệu người dùng nếu tìm thấy
        return res.data[0]
      } else {
        // Ném lỗi nếu không tìm thấy người dùng khớp
        throw new Error('Số điện thoại hoặc mật khẩu không đúng')
      }
    } catch (error) {
      // Ném lỗi mạng/API để Store bắt
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    }
  },

  /**
   * 2. HÀM ĐĂNG KÝ (REGISTER)
   * Mục đích: POST user mới nếu SĐT chưa tồn tại.
   * @throws {Error} Nếu SĐT đã tồn tại hoặc lỗi mạng.
   */
  async register(userData) {
    try {
      // 1. Kiểm tra SĐT đã tồn tại chưa
      const checkRes = await http.get(AUTH_ENDPOINT, { params: { phone: userData.phone } })
      if (checkRes.data.length > 0) {
        throw new Error('Số điện thoại đã được đăng ký.')
      }

      // 2. Tạo ID và token giả lập (Bắt buộc cho JSON Server)
      const newUser = {
        ...userData,
        id: Date.now(),
        token: `token_${Date.now()}`,
      }

      // 3. POST dữ liệu user mới
      const res = await http.post(AUTH_ENDPOINT, newUser)
      return res.data
    } catch (error) {
      // Ném lỗi lên Store xử lý
      throw new Error(error.response?.data?.message || error.message || 'Đăng ký thất bại.')
    }
  },

  /** 3. CẬP NHẬT THÔNG TIN CÁ NHÂN (USER PROFILE) */
  async updateProfile(userId, updateData) {
    try {
      // PUT/PATCH để cập nhật thông tin cá nhân (tên, địa chỉ)
      const res = await http.patch(`${AUTH_ENDPOINT}/${userId}`, updateData)
      return res.data
    } catch (error) {
      throw new Error('Cập nhật thông tin thất bại. Vui lòng thử lại.')
    }
  },

  /** 4. ADMIN: TẢI DANH SÁCH TẤT CẢ NGƯỜI DÙNG */
  async fetchUsers(params = {}) {
    try {
      // Thêm params cho phân trang/tìm kiếm nếu cần
      const res = await http.get(AUTH_ENDPOINT, { params })
      return res.data
    } catch (error) {
      throw new Error('Không thể tải danh sách người dùng.')
    }
  },

  /** 5. ADMIN: CẬP NHẬT VAI TRÒ/DỮ LIỆU NGƯỜI DÙNG */
  async updateUserData(userId, updateData) {
    try {
      // PATCH để cập nhật vai trò, mật khẩu, hoặc thông tin khác của người dùng
      const res = await http.patch(`${AUTH_ENDPOINT}/${userId}`, updateData)
      return res.data
    } catch (error) {
      throw new Error('Không thể cập nhật dữ liệu người dùng.')
    }
  },
}

export default authApi
