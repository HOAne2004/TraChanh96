import api from './index'

const uploadApi = {
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Lấy base URL backend đúng (http hoặc https)
      const base = api.defaults.baseURL.replace('/api', '')

      // Trả URL hoàn chỉnh
      return `${base}${data.url}`
    } catch (err) {
      console.error('❌ Lỗi tải lên hình ảnh:', err)
      throw new Error(err.response?.data?.message || 'Tải ảnh lên thất bại.')
    }
  },
}

export default uploadApi
