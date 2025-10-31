// src/services/http.js
import axios from 'axios'

// ⚙️ Cấu hình HTTP Client cơ bản
const http = axios.create({
  baseURL: 'http://localhost:3000', // Có thể dùng biến môi trường (Vite/Webpack)
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

export default http