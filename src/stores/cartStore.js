import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const totalQuantity = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => {
      const basePrice = Number(item.price) || 0;
      const sizePrice = Number(item.sizePrice) || 0;
      const toppingPrice = Number(item.toppingPrice) || 0;
      return sum + (basePrice + sizePrice + toppingPrice) * item.quantity;
    }, 0)
  )

  // Actions - Client Side
  function addToCart(item) {
    const existingItem = cartItems.value.find(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.sugar === item.sugar &&
        i.ice === item.ice &&
        JSON.stringify(i.toppings) === JSON.stringify(item.toppings)
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cartItems.value.push(item);
    }
  }

  function removeFromCart(id) {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  function updateQuantity(id, quantity) {
    const item = cartItems.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  // Actions - API Calls
  const syncCartToServer = async (userId) => {
    if (!userId) return
    
    loading.value = true
    error.value = null
    
    try {
      await api.post('/carts', {
        userId,
        items: cartItems.value,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      error.value = err.message
      console.error('Lỗi đồng bộ giỏ hàng:', err)
    } finally {
      loading.value = false
    }
  }

  const loadCartFromServer = async (userId) => {
    if (!userId) return
    
    loading.value = true
    error.value = null
    
    try {
      const { data } = await api.get(`/carts?userId=${userId}`)
      if (data.length > 0) {
        cartItems.value = data[0].items || []
      }
    } catch (err) {
      error.value = err.message
      console.error('Lỗi tải giỏ hàng:', err)
    } finally {
      loading.value = false
    }
  }

  // Watch
  watch(cartItems, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  return {
    // State
    cartItems,
    loading,
    error,
    
    // Computed
    totalQuantity,
    totalPrice,
    
    // Actions - Client
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    
    // Actions - API
    syncCartToServer,
    loadCartFromServer,
  }
})