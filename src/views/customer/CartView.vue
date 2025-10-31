<script setup>
import NavLink from '@/components/common/NavLink.vue'
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
// 🚨 Lưu ý: Cần thêm import RouterLink nếu muốn dùng trong script
import { RouterLink } from 'vue-router'

// Đảm bảo đường dẫn này đúng với vị trí file của bạn
import emptyCartImage from '@/assets/others/empty-cart.png'

const appStore = useAppStore()
const cartStore = useCartStore()

// totalPrice là computed từ Store, nó đã an toàn (number)
const { cartItems, totalPrice } = storeToRefs(cartStore)
const { storePolicies } = storeToRefs(appStore)

onMounted(async () => {
  await appStore.fetchStorePolicies()
})

// Format tiền (Giữ nguyên)
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

// Tính giá an toàn cho mỗi item (Giữ nguyên - Rất cần thiết!)
const getItemPrice = (item) => {
  try {
    const basePrice = Number(item.price) || 0
    const sizePrice = Number(item.sizePrice) || 0
    // Đảm bảo toppingPrice cũng được tính toán an toàn
    const toppingPrice = Array.isArray(item.toppings)
      ? item.toppings.reduce((sum, t) => sum + (Number(t.price) || 0), 0)
      : 0

    // 🚨 Ép kiểu toàn bộ kết quả về Number để tránh lỗi NaN khi hiển thị
    return Number((basePrice + sizePrice + toppingPrice) * item.quantity)
  } catch (error) {
    console.error('Lỗi tính giá:', error, item)
    return 0
  }
}

// Hiển thị toppings an toàn (Giữ nguyên)
const getToppingsDisplay = (toppings) => {
  if (!toppings || !Array.isArray(toppings) || toppings.length === 0) {
    return ''
  }
  return toppings.map((t) => t.name || '').join(', ')
}

// Kiểm tra item có options không (Giữ nguyên)
const hasOptions = (item) => {
  return item.size || item.sugar || item.ice || (item.toppings && item.toppings.length > 0)
}

// Tổng cộng
const shippingFee = computed(() => {
  if (cartItems.value.length === 0) {
    return 0
  }
  // Đảm bảo giá trị lấy ra là số, nếu không có thì là 0
  return Number(storePolicies.value?.[0]?.deliveryFee) || 0
})

// 🚨 Tối ưu hóa: Gọi totalPrice trực tiếp
const subtotal = computed(() => Number(totalPrice.value))

// 🚨 Tối ưu hóa: Total luôn là số
const total = computed(() => Number(subtotal.value) + Number(shippingFee.value))

// Thanh toán (Giữ nguyên)
const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('Giỏ hàng của bạn đang trống!')
    return
  }
  alert('Chuyển đến trang thanh toán!')
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-2 space-y-4">
      <div class="flex justify-between">
        <h2 class="text-2xl font-semibold mb-4 dark:text-green-500">Giỏ hàng của bạn</h2>
        <button
          v-if="cartItems.length"
          @click="cartStore.clearCart()"
          class="text-md font-medium text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>
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

          <div v-if="hasOptions(item)" class="text-sm text-gray-500 space-y-1 dark:text-green-200">
            <p v-if="item.size">Size: {{ item.size }}</p>
            <p v-if="item.sugar">Đường: {{ item.sugar }}</p>
            <p v-if="item.ice">Đá: {{ item.ice }}</p>
            <p v-if="item.toppings && item.toppings.length > 0">
              Topping: {{ getToppingsDisplay(item.toppings) }}
            </p>
          </div>

          <div class="flex items-center gap-3 mt-2">
            <button
              @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
              class="px-2 py-1 border rounded hover:bg-gray-100"
            >
              -
            </button>
            <span class="font-medium">{{ item.quantity }}</span>
            <button
              @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
              class="px-2 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

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

      <div v-if="cartItems.length === 0" class="text-center py-10 text-gray-500">
        <div class="max-w-xs mx-auto mb-4">
          <img
            :src="emptyCartImage"
            alt="Giỏ hàng trống"
            title="Giỏ hàng trống"
            class="opacity-70 w-full h-auto dark:opacity-100"
          />
        </div>
        <p class="text-gray-500 text-lg mb-2 dark:text-gray-200">Giỏ hàng của bạn đang trống!!!</p>
        <NavLink to="/products" variant="outline" class="text-gray-400 text-md"
          >Hãy thêm món ngon đầu tiên nào!</NavLink
        >
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow h-fit dark:bg-gray-600">
      <h3 class="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h3>
      <div class="flex justify-between mb-2">
        <span>Tạm tính:</span>
        <span>{{ formatCurrency(totalPrice) }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span>Phí giao hàng:</span>
        <span>{{ formatCurrency(shippingFee) }}</span>
      </div>
      <div class="border-t my-3"></div>
      <div class="flex justify-between font-bold text-lg">
        <span>Tổng cộng:</span>
        <span>{{ formatCurrency(total) }}</span>
      </div>

      <button
        @click="checkout"
        class="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
      >
        Thanh toán ngay
      </button>
    </div>
  </div>
</template>
