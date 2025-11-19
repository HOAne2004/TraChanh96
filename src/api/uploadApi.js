import api from './index' 

const UPLOAD_ENDPOINT = '/upload'

const uploadApi = {
  /**
   * Tải file (ảnh) lên server.
   * @param {File} file - File object (thường lấy từ <input type="file">)
   * @returns {string} URL công khai của file đã tải lên (ví dụ: "/uploads/image.png")
   * @throws {Error} Nếu tải lên thất bại.
   */
  async uploadImage(file) {
    // 1. Tạo đối tượng FormData
    const formData = new FormData()
    // Tên 'file' phải khớp với tham số (IFormFile file) trong C# Controller
    formData.append('file', file)

    try {
      // 2. Gửi request POST
      const { data } = await api.post(UPLOAD_ENDPOINT, formData, {
        // 3. ⭐️ QUAN TRỌNG: Ghi đè Header thành 'multipart/form-data'
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // 4. Trả về URL (C# trả về { url: "..." })
      return data.url
    } catch (err) {
      console.error('❌ Lỗi tải lên hình ảnh:', err)
      throw new Error(err.response?.data?.message || 'Tải ảnh lên thất bại.')
    }
  },
}

export default uploadApi
