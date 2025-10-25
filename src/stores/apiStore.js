import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

// ⚙️ Cấu hình baseURL — chỉ cần đổi 1 dòng khi dùng API thật
const api = axios.create({
  baseURL: 'http://localhost:3000', // ← JSON Server URL
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

export const useApiStore = defineStore('apiStore', () => {
  // 🧩 STATE
  const products = ref([])
  const categories = ref([])
  const stores = ref([])
  const news = ref([])
  const footerInfo = ref([])
  const storePolicies = ref([])
  const toppings = ref([])
  const sizes = ref([])
  const sugarLevels = ref([])
  const iceLevels = ref([])

  // 🧭 HELPER
  const handleError = (error, name) => {
    console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  }

  // 📦 API FUNCTIONS

  const fetchFooterInfo = async () => {
    if (footerInfo.value.length) return
    try {
      const { data } = await api.get('/footerInfo')
      footerInfo.value = data
    } catch (err) {
      handleError(err, 'footerInfo')
    }
  }
  const fetchStorePolicies = async () => {
    if (storePolicies.value.length) return
    try {
      const { data } = await api.get('/storePolicies')
      storePolicies.value = data
    } catch (err) {
      handleError(err, 'storePolicies')
    }
  }
  const fetchProducts = async () => {
    if (products.value.length) return
    try {
      const { data } = await api.get('/products')
      products.value = data
    } catch (err) {
      handleError(err, 'products')
    }
  }

  const fetchCategories = async () => {
    if (categories.value.length) return
    try {
      const { data } = await api.get('/categories')
      categories.value = data
    } catch (err) {
      handleError(err, 'categories')
    }
  }

  const fetchStores = async () => {
    if (stores.value.length) return
    try {
      const { data } = await api.get('/stores')
      stores.value = data
    } catch (err) {
      handleError(err, 'stores')
    }
  }

  const fetchNews = async () => {
    if (news.value.length) return
    try {
      const { data } = await api.get('/news')
      news.value = data
    } catch (err) {
      handleError(err, 'news')
    }
  }

  const fetchToppings = async () => {
    if (toppings.value.length) return
    try {
      const { data } = await api.get('/toppings')
      toppings.value = data
    } catch (err) {
      handleError(err, 'toppings')
    }
  }

  const fetchSizes = async () => {
    if (sizes.value.length) return
    try {
      const { data } = await api.get('/sizes')
      sizes.value = data
    } catch (err) {
      handleError(err, 'sizes')
    }
  }

  const fetchSugarLevels = async () => {
    if (sugarLevels.value.length) return
    try {
      const { data } = await api.get('/sugarLevels')
      sugarLevels.value = data
    } catch (err) {
      handleError(err, 'sugarLevels')
    }
  }

    const fetchIceLevels = async () => {
    if (iceLevels.value.length) return
    try {
      const { data } = await api.get('/iceLevels')
      iceLevels.value = data
    } catch (err) {
      handleError(err, 'iceLevels')
    }
  }

  // 🔁 EXPORT
  return {
    //data
    products,
    categories,
    stores,
    news,
    footerInfo,
    storePolicies,
    toppings,
    sizes,
    sugarLevels,
    iceLevels,

    //methods
    fetchProducts,
    fetchCategories,
    fetchStores,
    fetchNews,
    fetchStorePolicies,
    fetchFooterInfo,
    fetchToppings,
    fetchSizes,
    fetchSugarLevels,
    fetchIceLevels,
  }
})
