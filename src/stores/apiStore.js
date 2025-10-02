import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('productStore', () => {
  const products = ref([])
  const categories = ref([])
  const stores = ref([])
  const news = ref([])

  const fetchProducts = async () => {
    if (products.value.length) return // tránh gọi lại
    const res = await fetch('http://localhost:3000/products')
    products.value = await res.json()
  }

  const fetchCategories = async () => {
    if (categories.value.length) return
    const res = await fetch('http://localhost:3000/categories')
    categories.value = await res.json()
  }

  const fetchStores = async () => {
    if (stores.value.length) return
    const res = await fetch('http://localhost:3000/stores')
    stores.value = await res.json()
  }

  const fetchNews = async () => {
    if (news.value.length) return
    const res = await fetch('http://localhost:3000/news')
    news.value = await res.json()
  }

  return {
    products,
    categories,
    stores,
    news,
    fetchProducts,
    fetchCategories,
    fetchStores,
    fetchNews,
  }
})
