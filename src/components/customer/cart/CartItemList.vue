<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { RouterLink } from 'vue-router'
import emptyCartImage from '@/assets/others/empty-cart.png' // Import ảnh

const cartStore = useCartStore()

const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
})

// Format tiền (giữ nguyên logic từ View cũ)
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

// Tính giá an toàn cho mỗi item (giữ nguyên logic từ View cũ)
const getItemPrice = (item) => {
  try {
    const basePrice = Number(item.price) || 0
    const sizePrice = Number(item.sizePrice) || 0
    const toppingPrice = Array.isArray(item.toppings)
      ? item.toppings.reduce((sum, t) => sum + (Number(t.price) || 0), 0)
      : 0
    return Number((basePrice + sizePrice + toppingPrice) * item.quantity)
  } catch (error) {
    console.error('Lỗi tính giá:', error, item)
    return 0
  }
}

// Hiển thị toppings an toàn (giữ nguyên logic từ View cũ)
const getToppingsDisplay = (toppings) => {
  if (!toppings || !Array.isArray(toppings) || toppings.length === 0) {
    return ''
  }
  return toppings.map((t) => t.name || '').join(', ')
}

// Kiểm tra item có options không (giữ nguyên logic từ View cũ)
const hasOptions = (item) => {
  return item.size || item.sugar || item.ice || (item.toppings && item.toppings.length > 0)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header và nút Clear All -->
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4 dark:text-green-500">Giỏ hàng của bạn</h2>
      <button
        v-if="cartItems.length"
        @click="cartStore.clearCart()"
        class="text-md font-medium text-red-500 hover:underline"
      >
        Xóa tất cả
      </button>
    </div>

    <!-- Danh sách sản phẩm -->
    <div
      v-for="item in cartItems"
      :key="item.id"
      class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow dark:bg-gray-600"
    >
      <router-link :to="`/products/${item.productId}`">
        <img
          :src="item.image"
          title="Xem chi tiết"
          :alt="item.name"
          class="w-24 h-24 object-cover rounded-xl"
        />
      </router-link>
      <div class="flex-1">
        <h3 class="font-semibold text-lg">{{ item.name }}</h3>

        <!-- Tùy chọn -->
        <div v-if="hasOptions(item)" class="text-sm text-gray-500 space-y-1 dark:text-green-200">
          <p v-if="item.size">Size: {{ item.size }}</p>
          <p v-if="item.sugar">Đường: {{ item.sugar }}</p>
          <p v-if="item.ice">Đá: {{ item.ice }}</p>
          <p v-if="item.toppings && item.toppings.length > 0">
            Topping: {{ getToppingsDisplay(item.toppings) }}
          </p>
        </div>

        <!-- Điều chỉnh số lượng -->
        <div class="flex items-center gap-3 mt-2">
          <button
            @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
            class="px-2 py-1 border rounded hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700"
          >
            -
          </button>
          <span class="font-medium">{{ item.quantity }}</span>
          <button
            @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
            class="px-2 py-1 border rounded hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>

      <!-- Giá và nút xóa -->
      <div class="text-right">
        <p class="text-lg font-semibold">
          {{ formatCurrency(getItemPrice(item)) }}
        </p>
        <button
          @click="cartStore.removeFromCart(item.id)"
          class="text-sm text-red-500 hover:underline"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
</template>